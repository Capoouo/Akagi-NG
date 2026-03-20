import platform
import shutil
import subprocess
import sys
import tarfile
import tempfile
import tomllib
import urllib.request
from pathlib import Path

RELEASE_DATE = "20260320"
PYTHON_VERSION = "3.12.13"
URL_TEMPLATE = "https://github.com/astral-sh/python-build-standalone/releases/download/{date}/cpython-{python_version}+{date}-{arch}-{os_tag}-install_only.tar.gz"


def get_download_url() -> str:
    system = platform.system().lower()
    machine = platform.machine().lower()

    if system == "windows":
        os_tag = "pc-windows-msvc"
        arch = "x86_64" if machine in ["amd64", "x86_64"] else "aarch64"
    elif system == "darwin":
        os_tag = "apple-darwin"
        arch = "aarch64" if machine in ["arm64", "aarch64"] else "x86_64"
    else:
        os_tag = "unknown-linux-gnu"
        arch = "aarch64" if machine in ["arm64", "aarch64"] else "x86_64"

    return URL_TEMPLATE.format(date=RELEASE_DATE, python_version=PYTHON_VERSION, arch=arch, os_tag=os_tag)


def write_version_to_dest(backend_root: Path, packages_dest: Path):
    pyproject_path = backend_root / "pyproject.toml"
    version = tomllib.loads(pyproject_path.read_text(encoding="utf-8"))["project"]["version"]
    version_file_path = packages_dest / "akagi_ng" / "_version.py"
    version_file_content = f'''"""
This file is auto-generated during build.
Do NOT edit it manually!
"""
__version__ = "{version}"
'''
    if version_file_path.parent.exists():
        version_file_path.write_text(version_file_content, encoding="utf-8")


def cleanup_python_dist(python_dir: Path):
    print("   🧹 Sweeping Python standard library bloat...")
    # Delete C/C++ headers
    for p in python_dir.glob("**/include"):
        shutil.rmtree(p, ignore_errors=True)
    # Delete static libraries
    for p in python_dir.rglob("*.a"):
        p.unlink(missing_ok=True)
    # Delete manual pages
    for p in python_dir.glob("**/share"):
        shutil.rmtree(p, ignore_errors=True)
    # Delete useless stdlib packages
    for useless_dir in ["idlelib", "tkinter", "turtledemo", "test"]:
        for p in python_dir.rglob(useless_dir):
            if p.is_dir():
                shutil.rmtree(p, ignore_errors=True)


def cleanup_app_packages(app_packages_dir: Path):
    print("   🧹 Cleaning up bloated files...")
    # Delete C/C++ source files in packages
    for p in app_packages_dir.rglob("*.c"):
        p.unlink(missing_ok=True)
    for p in app_packages_dir.rglob("*.cpp"):
        p.unlink(missing_ok=True)
    # Delete pip metadata
    for p in app_packages_dir.glob("*.dist-info"):
        shutil.rmtree(p, ignore_errors=True)
    for p in app_packages_dir.glob("*.egg-info"):
        shutil.rmtree(p, ignore_errors=True)


def main():
    current_dir = Path(__file__).parent
    backend_root = current_dir.parent
    project_root = backend_root.parent

    dist_dir = project_root / "dist" / "backend" / "akagi-ng"
    packages_dest = dist_dir / "app_packages"

    print("📦 Building Akagi-NG Portable Backend...")

    if dist_dir.exists():
        shutil.rmtree(dist_dir)

    dist_dir.mkdir(parents=True, exist_ok=True)

    url = get_download_url()
    print(f"   ⬇️ Downloading Portable Python from: {url}")

    with tempfile.NamedTemporaryFile(delete=False, suffix=".tar.gz") as tf:
        temp_path = tf.name

    urllib.request.urlretrieve(url, temp_path)

    print("   📦 Extracting Portable Python...")
    with tarfile.open(temp_path, "r:gz") as tar:
        # Standalone python tarballs have a root directory 'python'
        # Extracting it into dist_dir means it creates dist/backend/akagi-ng/python directly!
        tar.extractall(path=dist_dir, filter="data")

    Path(temp_path).unlink()

    # 清理刚下载解压好的纯净 Python 环境，丢掉不需要的编译头文件和静态库
    cleanup_python_dist(dist_dir / "python")

    print(f"   📥 Exporting Project and Dependencies to {packages_dest}...")
    # Automatically collect dependencies into app_packages
    cmd = [
        sys.executable,
        "-m",
        "pip",
        "install",
        ".",
        "--target",
        str(packages_dest),
    ]

    subprocess.run(cmd, cwd=backend_root, check=True)

    print("   ⚡ Pre-compiling Python bytecode for extreme startup performance...")
    # 提前把所有源码编译成 .pyc 保存到硬盘，避免用户在终端（尤其是 Mac 只读目录）第一次打开时疯狂消耗 CPU 编译
    subprocess.run([sys.executable, "-m", "compileall", "-q", str(packages_dest)], check=False)

    # Strip unneeded files
    cleanup_app_packages(packages_dest)

    print("   🔖 Generating version file inside the bundle...")
    write_version_to_dest(backend_root, packages_dest)

    print(f"✅ Backend build successful! Portable backend is at: {dist_dir}")


if __name__ == "__main__":
    main()
