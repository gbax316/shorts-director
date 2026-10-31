"""
userenv.py — the Windows user environment, read fresh from the registry.

A key saved with SetEnvironmentVariable(..., 'User') only reaches processes started after it was
set; an app (or terminal) opened earlier never sees it in os.environ. Reading HKCU\\Environment
directly closes that gap. Elsewhere this returns an empty dict.
"""
import sys


def windows_user_env():
    if sys.platform != "win32":
        return {}
    import winreg
    out = {}
    try:
        with winreg.OpenKey(winreg.HKEY_CURRENT_USER, "Environment") as h:
            i = 0
            while True:
                try:
                    name, value, _ = winreg.EnumValue(h, i)
                except OSError:
                    break
                if isinstance(value, str):
                    out[name] = value
                i += 1
    except OSError:
        pass
    return out
