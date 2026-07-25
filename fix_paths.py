import glob
import re

js_files = glob.glob("/home/nthdat/2937/public/tools/monkeytype/monkeytype.com/js/*.js")
for f in js_files:
    with open(f, "r") as file:
        content = file.read()
    
    # Replace strings starting with /layouts/, /languages/, etc.
    new_content = re.sub(r"([\"'`])\/(layouts|languages|images|sounds|themes|css)\/", r"\1./\2/", content)
    
    if new_content != content:
        with open(f, "w") as file:
            file.write(new_content)
        print(f"Fixed absolute paths in {f}")
