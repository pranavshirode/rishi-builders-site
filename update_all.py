import os
import re

svg_socials = """<div class="foot-social">
        <a href="#" aria-label="Facebook"><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/></svg></a>
        <a href="#" aria-label="LinkedIn"><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.16-3.8c-1.08 0-1.8.57-2.14 1.14v-1H9v9h3.04v-4.93c0-1.28.33-2.53 1.93-2.53 1.58 0 1.6 1.48 1.6 2.6V18.5h3.04M5.95 6.72a1.8 1.8 0 0 0 0 3.6 1.8 1.8 0 0 0 0-3.6M7.5 18.5V9.5H4.4v9h3.1z"/></svg></a>
        <a href="#" aria-label="Instagram"><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.4 5.6 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.6 18.4 4 16.4 4H7.6m4.4 4.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7m0 2a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m5.3-2.4a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4z"/></svg></a>
        <a href="#" aria-label="YouTube"><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M21.58 7.19c-.23-.86-.91-1.54-1.77-1.77C18.25 5 12 5 12 5s-6.25 0-7.81.42c-.86.23-1.54.91-1.77 1.77C2 8.75 2 12 2 12s0 3.25.42 4.81c.23.86.91 1.54 1.77 1.77C5.75 19 12 19 12 19s6.25 0 7.81-.42c.86-.23 1.54-.91 1.77-1.77C22 15.25 22 12 22 12s0-3.25-.42-4.81zM10 15V9l5.2 3-5.2 3z"/></svg></a>
      </div>"""

badges = """<div class="container foot-badges"><img src="assets/images/badges/credai.png" alt="CREDAI Member" class="badge-logo"><img src="assets/images/badges/maharera.png" alt="MahaRERA Registered" class="badge-logo"></div>"""

for filename in os.listdir('.'):
    if filename.endswith('.html'):
        with open(filename, 'r') as f:
            content = f.read()

        # 1. Remove proof-bar
        content = re.sub(r'<div class="proof-bar">.*?</div>\n*', '', content, flags=re.IGNORECASE)

        # 2. Remove "Design Proof - Built on Wix"
        content = content.replace('<span>Design Proof — Built on Wix</span>', '')
        
        # 3. Replace foot-social
        content = re.sub(r'<div class="foot-social">.*?</div>', svg_socials, content, flags=re.IGNORECASE)
        
        # 4. Replace foot-badges
        content = re.sub(r'<div class="container foot-badges">.*?</div>', badges, content, flags=re.IGNORECASE)

        # 5. Remove legal disclaimer
        content = content.replace('&nbsp;·&nbsp; Placeholder text for design proof — final legal copy to be reviewed by your legal counsel before publishing.', '')

        with open(filename, 'w') as f:
            f.write(content)
print("Updated all HTML files.")
