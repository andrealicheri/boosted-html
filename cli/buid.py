import PyInstaller.__main__

def bundle_scripts():
    args = [
        '--onefile',        
        'blaze.py' 
    ]
    PyInstaller.__main__.run(args)
if __name__ == "__main__":
    bundle_scripts()