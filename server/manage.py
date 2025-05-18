#!/usr/bin/env python
import os
import sys

def main():
    """Run administrative tasks with debug logs."""
    
    # ✅ Force Django to use your correct settings module
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'elimu_backend.settings')

    # 🔍 Debug print to confirm settings being used
    print("✅ DEBUG: DJANGO_SETTINGS_MODULE =", os.environ.get('DJANGO_SETTINGS_MODULE'))

    # 🔍 Print current working directory and system path
    print("📁 DEBUG: Current Directory =", os.getcwd())
    print("📂 DEBUG: sys.path =", sys.path)

    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        print("❌ ImportError: Failed to import Django.")
        raise ImportError(
            "Couldn't import Django. Make sure it's installed and available on your PYTHONPATH environment variable.\n"
            "Did you forget to activate your virtual environment?"
        ) from exc

    # 🔄 Execute the Django management command
    execute_from_command_line(sys.argv)

if __name__ == '__main__':
    main()
