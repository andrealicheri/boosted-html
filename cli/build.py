import PyInstaller.__main__
import os
import shutil

def bundle_scripts():
    # Specify PyInstaller command line arguments
    args = [
        '--onefile',
        'blaze.py'
    ]
    PyInstaller.__main__.run(args)
    if os.path.exists('build'):
        shutil.rmtree('build')
    if os.path.exists('blaze.spec'):
        os.remove('blaze.spec')
    os.rename("dist/blaze.exe", "blaze.exe")
    if os.path.exists('dist'):
        shutil.rmtree('dist')

if __name__ == "__main__":
    bundle_scripts()
