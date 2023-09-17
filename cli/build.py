import PyInstaller.__main__
import os
import shutil

def bundle_scripts():
    args = [
        '--onefile',
        'blaze.py'
    ]
    PyInstaller.__main__.run(args)
    os.remove("blaze.exe")
    shutil.rmtree('build')
    os.remove('blaze.spec')
    os.rename("dist/blaze.exe", "blaze.exe")
    shutil.rmtree('dist')

if __name__ == "__main__":
    bundle_scripts()
