#!/usr/bin/env python3
"""
Python Library Installer
A clean installer for Python dependencies with virtual environment support
"""

import os
import sys
import platform
import subprocess
import time
import random
from pathlib import Path


class ColoredOutput:
    """Simple colored output for terminal with animations"""
    
    def __init__(self):
        self.colors = {
            'red': '\x1b[31m',
            'green': '\x1b[32m',
            'yellow': '\x1b[33m',
            'blue': '\x1b[34m',
            'cyan': '\x1b[36m',
            'white': '\x1b[37m',
            'bright_blue': '\x1b[96m',
            'bright_green': '\x1b[92m',
            'dark_gray': '\x1b[90m',
            'reset': '\x1b[0m',
        }
        
        # Enable ANSI colors on Windows
        if platform.system() == 'Windows':
            os.system('')
    
    def print_box(self, text, color='blue'):
        """Print text in a box"""
        lines = text.split('\n')
        max_length = max(len(line) for line in lines)
        
        border = '─' * (max_length + 2)
        print(f"\n{self.colors[color]}┌{border}┐{self.colors['reset']}")
        for line in lines:
            print(f"{self.colors[color]}│ {line.ljust(max_length)} │{self.colors['reset']}")
        print(f"{self.colors[color]}└{border}┘{self.colors['reset']}\n")
    
    def progress_bar(self, current, total, width=40):
        """Create a progress bar"""
        percentage = round((current / total) * 100)
        filled = round((current / total) * width)
        empty = width - filled
        
        filled_bar = self.colors['bright_blue'] + '█' * filled
        empty_bar = self.colors['dark_gray'] + '░' * empty
        
        return (f"{self.colors['bright_blue']}[{filled_bar}{empty_bar}"
                f"{self.colors['bright_blue']}] {self.colors['bright_green']}{percentage}%"
                f"{self.colors['reset']} {self.colors['dark_gray']}({current}/{total})"
                f"{self.colors['reset']}")
    
    def update_progress(self, current, total, text=''):
        """Update progress on the same line"""
        sys.stdout.write('\r\x1b[K')
        progress = self.progress_bar(current, total)
        sys.stdout.write(f"{progress} {self.colors['blue']}{text}{self.colors['reset']}")
        sys.stdout.flush()
        if current == total:
            print()
    
    def loading_animation(self, text, duration=1.5):
        """Animated loading spinner"""
        spinners = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
        start_time = time.time()
        i = 0
        
        while time.time() - start_time < duration:
            sys.stdout.write(f"\r{self.colors['bright_blue']}{spinners[i]} {self.colors['bright_green']}{text}{self.colors['reset']}")
            sys.stdout.flush()
            i = (i + 1) % len(spinners)
            time.sleep(0.1)
        
        sys.stdout.write('\r\x1b[K')
        sys.stdout.flush()
    
    def success(self, message):
        """Print success message"""
        print(f"{self.colors['green']}✓{self.colors['reset']} {message}")
    
    def error(self, message):
        """Print error message"""
        print(f"{self.colors['red']}✗{self.colors['reset']} {message}")
    
    def info(self, message):
        """Print info message"""
        print(f"{self.colors['blue']}ℹ{self.colors['reset']} {message}")
    
    def warning(self, message):
        """Print warning message"""
        print(f"{self.colors['yellow']}⚠{self.colors['reset']} {message}")


class LibraryInstaller:
    """Main installer class"""
    
    def __init__(self):
        self.output = ColoredOutput()
        self.packages = []
        self.platform = platform.system()
        self.requirements_file = Path('requirements.txt')
        self.venv_path = Path('.venv')
    
    def get_python_command(self):
        """Get the appropriate Python command"""
        return 'python' if self.platform == 'Windows' else 'python3'
    
    def get_pip_command(self):
        """Get the path to pip in virtual environment"""
        if self.platform == 'Windows':
            return str(self.venv_path / 'Scripts' / 'pip.exe')
        else:
            return str(self.venv_path / 'bin' / 'pip')
    
    def get_python_executable(self):
        """Get the path to Python in virtual environment"""
        if self.platform == 'Windows':
            return str(self.venv_path / 'Scripts' / 'python.exe')
        else:
            return str(self.venv_path / 'bin' / 'python')
    
    def show_header(self):
        """Display header"""
        os.system('clear' if self.platform != 'Windows' else 'cls')
        
        header_text = f"""Python Library Installer
Platform: {self.platform}
Python: {sys.version.split()[0]}"""
        
        self.output.print_box(header_text, 'cyan')
    
    def load_requirements(self):
        """Load packages from requirements.txt"""
        print()
        self.output.info("Loading requirements.txt...")
        
        self.output.loading_animation("Analyzing requirements file", 1.0)
        
        if not self.requirements_file.exists():
            self.output.error("requirements.txt not found!")
            sys.exit(1)
        
        with open(self.requirements_file, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        
        for line in lines:
            line = line.strip()
            if line and not line.startswith('#'):
                pkg = line.split('#')[0].strip()
                if pkg:
                    self.packages.append(pkg)
        
        self.output.success(f"Found {len(self.packages)} packages to install")
        print()
    
    def create_venv(self):
        """Create a virtual environment"""
        if self.venv_path.exists():
            self.output.info("Virtual environment already exists")
            print()
            return
        
        venv_text = """Creating Virtual Environment
Setting up isolated Python environment
This keeps dependencies separate from system"""
        
        self.output.print_box(venv_text, 'cyan')
        
        self.output.loading_animation("Creating virtual environment", 1.5)
        
        try:
            subprocess.run(
                [self.get_python_command(), '-m', 'venv', str(self.venv_path)],
                check=True,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE
            )
            self.output.success("Virtual environment created successfully")
        except subprocess.CalledProcessError as e:
            self.output.warning("Virtual environment creation had issues, continuing...")
        
        print()
    
    def check_package_installed(self, pkg_name):
        """Check if a package is already installed"""
        package_name = pkg_name.split('==')[0].split('>=')[0].split('<=')[0].split('~=')[0]
        
        # Map package names to import names
        import_map = {
            'pillow': 'PIL',
            'pyjwt': 'jwt',
            'python-dateutil': 'dateutil',
        }
        
        import_name = import_map.get(package_name.lower(), package_name.replace('-', '_'))
        python_path = self.get_python_executable() if self.venv_path.exists() else sys.executable
        
        try:
            result = subprocess.run(
                [python_path, '-c', f'import {import_name}'],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                timeout=5
            )
            return result.returncode == 0
        except (subprocess.TimeoutExpired, Exception):
            return False
    
    def install_package(self, pkg_name):
        """Install a single package"""
        pip_path = self.get_pip_command() if self.venv_path.exists() else 'pip'
        
        try:
            subprocess.run(
                [pip_path, 'install', pkg_name],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                check=True,
                timeout=300
            )
            return True
        except (subprocess.CalledProcessError, subprocess.TimeoutExpired):
            # Fallback to python -m pip
            try:
                python_cmd = self.get_python_executable() if self.venv_path.exists() else sys.executable
                subprocess.run(
                    [python_cmd, '-m', 'pip', 'install', pkg_name],
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                    check=True,
                    timeout=300
                )
                return True
            except (subprocess.CalledProcessError, subprocess.TimeoutExpired):
                return False
    
    def install_packages(self):
        """Install all packages"""
        self.create_venv()
        
        self.output.info("Scanning installed packages...")
        self.output.loading_animation("Checking package status", 1.5)
        
        missing_packages = []
        installed_packages = []
        
        # Check which packages are already installed with progress bar
        for i, pkg in enumerate(self.packages, 1):
            self.output.update_progress(i, len(self.packages), f"Scanning {pkg}")
            
            if self.check_package_installed(pkg):
                installed_packages.append(pkg)
            else:
                missing_packages.append(pkg)
        
        sys.stdout.write('\r\x1b[K')
        sys.stdout.flush()
        
        self.output.success(f"Scan complete: {len(installed_packages)} already installed, {len(missing_packages)} to install")
        print()
        
        if not missing_packages:
            self.output.success("All packages are already installed!")
            return
        
        # Install missing packages
        self.output.info(f"Installing {len(missing_packages)} missing packages...")
        print()
        
        failed_packages = []
        
        for i, pkg in enumerate(missing_packages, 1):
            self.output.update_progress(i - 1, len(missing_packages), f"Installing {pkg}")
            
            success = self.install_package(pkg)
            
            sys.stdout.write('\r\x1b[K')
            sys.stdout.flush()
            
            if success:
                self.output.success(f"[{i}/{len(missing_packages)}] {pkg} - Installation complete")
            else:
                self.output.error(f"[{i}/{len(missing_packages)}] {pkg} - Installation failed")
                failed_packages.append(pkg)
        
        print()
        
        if failed_packages:
            self.output.warning(f"{len(failed_packages)} packages failed to install:")
            for pkg in failed_packages:
                print(f"  - {pkg}")
        else:
            self.output.success("All packages installed successfully!")
        
        print()
    
    def show_completion(self):
        """Show completion message"""
        if self.platform == 'Windows':
            activation_cmd = '.venv\\Scripts\\activate.bat\n  (or for PowerShell: .venv\\Scripts\\Activate.ps1)'
        else:
            activation_cmd = 'source .venv/bin/activate'
        
        completion_text = f"""Installation Complete!
All required libraries are now installed.

To activate the virtual environment:
  {activation_cmd}

Then you can run your Python scripts."""
        
        self.output.print_box(completion_text, 'green')
    
    def run(self):
        """Main installation flow"""
        try:
            self.show_header()
            self.load_requirements()
            self.install_packages()
            self.show_completion()
        except KeyboardInterrupt:
            print()
            self.output.error("Installation cancelled by user")
            sys.exit(1)
        except Exception as e:
            print()
            self.output.error(f"Installation failed: {str(e)}")
            sys.exit(1)


if __name__ == '__main__':
    installer = LibraryInstaller()
    installer.run()
