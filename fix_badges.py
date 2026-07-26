import os
import re

new_badges = """<div class="container foot-badges">
    <div class="badge-logo" style="display:inline-flex; align-items:center; border: 1px solid rgba(255,255,255,0.2); padding: 0 16px; border-radius: 4px; font-size: 12px; font-weight: 700; color: #fff; text-transform: uppercase; letter-spacing: 0.5px;">CREDAI Member</div>
    <div class="badge-logo" style="display:inline-flex; align-items:center; border: 1px solid rgba(255,255,255,0.2); padding: 0 16px; border-radius: 4px; font-size: 12px; font-weight: 700; color: #fff; text-transform: uppercase; letter-spacing: 0.5px;">MahaRERA Registered</div>
  </div>"""

for filename in os.listdir('.'):
    if filename.endswith('.html'):
        with open(filename, 'r') as f:
            content = f.read()
        
        # Replace the entire foot-badges container using DOTALL to match across newlines
        content = re.sub(
            r'<div class="container foot-badges">.*?</div>', 
            new_badges, 
            content, 
            flags=re.IGNORECASE | re.DOTALL
        )
        
        with open(filename, 'w') as f:
            f.write(content)

print("Badges updated in all HTML files.")
