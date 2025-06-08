#!/usr/bin/env python
import os
import sys

def main():
    """Run administrative tasks with debug logs enabled for deployment and development."""

    # ✅ Set the default Django settings module
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'elimu_backend.settings')

    # 🪵 Debug log: current environment and path info
    print("✅ DEBUG: Using DJANGO_SETTINGS_MODULE =", os.environ.get('DJANGO_SETTINGS_MODULE'))
    print("📁 DEBUG: Current Working Directory =", os.getcwd())
    print("📂 DEBUG: sys.path =", sys.path)

    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        print("❌ ERROR: Failed to import Django. Check if your virtual environment is activated and Django is installed.")
        raise ImportError(
            "Couldn't import Django. Ensure it's installed and available on your PYTHONPATH.\n"
            "Tip: Activate your virtual environment with `source venv/bin/activate` or check `requirements.txt`."
        ) from exc

    # ▶️ Run the Django CLI command
    execute_from_command_line(sys.argv)

if __name__ == '__main__':
    main()
