#!/usr/bin/env python3
"""
HTML Image Updater
Updates image references in HTML to use WebP with PNG/JPG fallback
"""

import os
import sys
import re
from pathlib import Path

def install_dependencies():
    """Install required dependencies"""
    try:
        from rich.console import Console
        from rich.table import Table
        from rich.panel import Panel
        from rich import box
    except ImportError:
        print("Installing required library (rich)...")
        import subprocess
        try:
            subprocess.run([sys.executable, '-m', 'pip', 'install', 'rich'], 
                         check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            print("✓ Library installed! Please run the script again.")
            sys.exit(0)
        except:
            print("❌ Failed to install library. Please run: pip install rich")
            sys.exit(1)

install_dependencies()

from rich.console import Console
from rich.table import Table
from rich.panel import Panel
from rich.prompt import Confirm
from rich import box

console = Console()

def find_image_tags(html_content):
    """
    Find all img tags in HTML content
    Returns list of (full_match, src_path, attributes)
    """
    # Pattern to match img tags
    pattern = r'<img\s+([^>]*?)src=["\']([^"\']+\.(?:png|jpg|jpeg|PNG|JPG|JPEG))["\']([^>]*?)/?>'
    matches = re.finditer(pattern, html_content, re.IGNORECASE)
    
    results = []
    for match in matches:
        full_match = match.group(0)
        before_attrs = match.group(1)
        src_path = match.group(2)
        after_attrs = match.group(3)
        
        results.append({
            'full_match': full_match,
            'src_path': src_path,
            'before_attrs': before_attrs.strip(),
            'after_attrs': after_attrs.strip()
        })
    
    return results

def convert_to_webp_path(original_path):
    """Convert original image path to WebP path with webp subdirectory"""
    path = Path(original_path)
    
    # If it's in root, use webp/ directory
    if len(path.parts) == 1:
        return f"webp/{path.stem}.webp"
    
    # Otherwise, insert webp subdirectory before filename
    parts = list(path.parts)
    parent = Path(*parts[:-1])
    filename = path.stem + '.webp'
    
    return str(parent / 'webp' / filename)

def create_picture_tag(img_info):
    """Create picture tag with WebP and fallback"""
    original_src = img_info['src_path']
    webp_src = convert_to_webp_path(original_src)
    
    # Combine all attributes
    all_attrs = []
    if img_info['before_attrs']:
        all_attrs.append(img_info['before_attrs'])
    if img_info['after_attrs']:
        all_attrs.append(img_info['after_attrs'])
    
    attrs_str = ' '.join(all_attrs)
    if attrs_str:
        attrs_str = ' ' + attrs_str
    
    # Create picture tag
    picture_tag = f'''<picture>
        <source srcset="{webp_src}" type="image/webp">
        <img src="{original_src}"{attrs_str}>
    </picture>'''
    
    return picture_tag

def update_html_file(file_path, dry_run=True):
    """Update HTML file with picture tags"""
    
    # Read HTML file
    with open(file_path, 'r', encoding='utf-8') as f:
        html_content = f.read()
    
    # Find all image tags
    img_tags = find_image_tags(html_content)
    
    if not img_tags:
        console.print(f"[yellow]No image tags found in {file_path}[/yellow]")
        return 0
    
    console.print(f"\n[cyan]Found {len(img_tags)} image tags in {file_path}[/cyan]\n")
    
    # Create table to show changes
    table = Table(title="Image Conversions", box=box.ROUNDED, show_header=True, header_style="bold cyan")
    table.add_column("#", style="dim", width=4)
    table.add_column("Original Path", style="yellow")
    table.add_column("WebP Path", style="green")
    table.add_column("Type", style="cyan")
    
    # Track changes
    updated_content = html_content
    changes_made = 0
    
    for idx, img_info in enumerate(img_tags, 1):
        original_src = img_info['src_path']
        webp_src = convert_to_webp_path(original_src)
        
        # Determine image type based on path
        if 'hero' in original_src.lower() or 'illustration' in original_src.lower():
            img_type = "Hero"
        elif 'badge' in original_src.lower():
            img_type = "Badge"
        elif 'emoji' in original_src.lower():
            img_type = "Icon"
        elif 'profile' in original_src.lower():
            img_type = "Profile"
        else:
            img_type = "Other"
        
        table.add_row(
            str(idx),
            original_src[:50] + "..." if len(original_src) > 50 else original_src,
            webp_src[:50] + "..." if len(webp_src) > 50 else webp_src,
            img_type
        )
        
        # Replace with picture tag
        if not dry_run:
            picture_tag = create_picture_tag(img_info)
            updated_content = updated_content.replace(img_info['full_match'], picture_tag, 1)
            changes_made += 1
    
    console.print(table)
    console.print()
    
    # Show sample conversion
    if img_tags:
        console.print("[cyan]📝 Sample conversion:[/cyan]")
        console.print("\n[dim]Original:[/dim]")
        console.print(f"[yellow]{img_tags[0]['full_match'][:100]}...[/yellow]")
        console.print("\n[dim]New (with WebP):[/dim]")
        sample_picture = create_picture_tag(img_tags[0])
        console.print(f"[green]{sample_picture[:150]}...[/green]")
        console.print()
    
    # Write updated content if not dry run
    if not dry_run:
        # Backup original file
        backup_path = str(file_path) + '.backup'
        with open(backup_path, 'w', encoding='utf-8') as f:
            f.write(html_content)
        console.print(f"[dim]✓ Backup created: {backup_path}[/dim]")
        
        # Write updated file
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(updated_content)
        
        console.print(f"[green]✓ Updated {changes_made} image tags in {file_path}[/green]")
    
    return len(img_tags)

def main():
    """Main function"""
    console.print()
    console.print(Panel.fit(
        "[bold cyan]HTML Image Updater[/bold cyan]\n"
        "[dim]Convert <img> tags to <picture> tags with WebP support[/dim]",
        border_style="cyan"
    ))
    console.print()
    
    # Find HTML files
    html_files = list(Path('.').glob('*.html'))
    
    if not html_files:
        console.print("[red]No HTML files found in current directory![/red]")
        sys.exit(1)
    
    console.print(f"[cyan]Found {len(html_files)} HTML file(s):[/cyan]")
    for html_file in html_files:
        console.print(f"  • {html_file}")
    console.print()
    
    # First do a dry run
    console.print("[yellow]🔍 DRY RUN - Analyzing files...[/yellow]\n")
    
    total_images = 0
    for html_file in html_files:
        count = update_html_file(html_file, dry_run=True)
        total_images += count
    
    if total_images == 0:
        console.print("[yellow]No images to convert![/yellow]")
        sys.exit(0)
    
    console.print(f"\n[cyan]Total images to convert: {total_images}[/cyan]\n")
    
    # Ask for confirmation
    console.print("[bold]This will:[/bold]")
    console.print("  1. Create backup files (.backup)")
    console.print("  2. Replace all <img> tags with <picture> tags")
    console.print("  3. Add WebP source with PNG/JPG fallback")
    console.print()
    
    if Confirm.ask("[bold cyan]Proceed with conversion?[/bold cyan]", default=False):
        console.print("\n[green]✓ Starting conversion...[/green]\n")
        
        for html_file in html_files:
            update_html_file(html_file, dry_run=False)
        
        console.print()
        console.print(Panel(
            "[bold green]✓ Conversion complete![/bold green]",            border_style="green",
            box=box.ROUNDED
        ))
    else:
        console.print("\n[yellow]Conversion cancelled[/yellow]")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        console.print("\n[yellow]Interrupted by user[/yellow]")
        sys.exit(1)
    except Exception as e:
        console.print(f"\n[red]Error: {e}[/red]")
        sys.exit(1)
