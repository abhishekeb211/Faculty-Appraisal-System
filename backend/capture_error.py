import subprocess
import sys

result = subprocess.run([sys.executable, 'app.py'], 
                       capture_output=True, 
                       text=True,
                       encoding='utf-8',
                       errors='replace')

with open('error_output.txt', 'w', encoding='utf-8') as f:
    f.write("=== STDOUT ===\n")
    f.write(result.stdout)
    f.write("\n\n=== STDERR ===\n")
    f.write(result.stderr)
    f.write(f"\n\n=== EXIT CODE: {result.returncode} ===\n")

print("Output written to error_output.txt")
print(f"Exit code: {result.returncode}")
