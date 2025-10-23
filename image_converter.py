#!/usr/bin/env python3
"""
Image to WebP Converter
Converts PNG and JPG images to WebP format for web optimization
With fancy Rich terminal UI
"""

import os
import sys
from pathlib import Path
import time

def convert_to_webp(input_path, output_directory=None, quality=85):
    """
    Convert an image to WebP format and save in webp subdirectory
    
    Args:
        input_path: Path to input image
        output_directory: Directory to save WebP file (creates webp subdirectory)
        quality: WebP quality (0-100, default 85)
        
    Returns:
        tuple: (success, original_size_kb, webp_size_kb, reduction_percent, output_path)
    """
    try:
        from PIL import Image
    except ImportError:
        return (False, 0, 0, 0, None)
    
    input_path = Path(input_path)
    
    # Determine output path
    if output_directory:
        # Create webp subdirectory in the specified directory
        webp_dir = Path(output_directory) / 'webp'
        webp_dir.mkdir(parents=True, exist_ok=True)
        output_path = webp_dir / input_path.with_suffix('.webp').name
    else:
        # If root directory (.), save in root webp folder
        parent_dir = input_path.parent
        if str(parent_dir) == '.':
            webp_dir = Path('webp')
        else:
            webp_dir = parent_dir / 'webp'
        webp_dir.mkdir(parents=True, exist_ok=True)
        output_path = webp_dir / input_path.with_suffix('.webp').name
    
    try:
        # Open and convert image
        img = Image.open(input_path)
        
        # Convert RGBA to RGB if necessary (WebP supports both)
        if img.mode == 'RGBA':
            img.save(output_path, 'WEBP', quality=quality, method=6)
        else:
            img.save(output_path, 'WEBP', quality=quality)
        
        # Calculate file size comparison
        original_size = os.path.getsize(input_path) / 1024  # KB
        webp_size = os.path.getsize(output_path) / 1024  # KB
        reduction = ((original_size - webp_size) / original_size) * 100
        
        return (True, original_size, webp_size, reduction, str(output_path))
    except Exception as e:
        return (False, 0, 0, 0, None)

def scan_directories(directories):
    """
    Scan directories for images to convert
    
    Args:
        directories: List of (directory, quality) tuples
        
    Returns:
        List of (file_path, directory, quality) tuples
    """
    formats = ('*.png', '*.jpg', '*.jpeg', '*.PNG', '*.JPG', '*.JPEG')
    files_to_convert = []
    
    for directory, quality in directories:
        if os.path.exists(directory):
            path = Path(directory)
            for format_pattern in formats:
                for img_path in path.glob(format_pattern):
                    files_to_convert.append((img_path, directory, quality))
    
    return files_to_convert

if __name__ == "__main__":
    # Check and install dependencies
    try:
        from rich.console import Console
        from rich.progress import Progress, SpinnerColumn, BarColumn, TextColumn, TimeRemainingColumn
        from rich.table import Table
        from rich.panel import Panel
        from rich.layout import Layout
        from rich import box
        from rich.live import Live
        from PIL import Image
    except ImportError:
        print("Installing required libraries (rich, Pillow)...")
        import subprocess
        try:
            subprocess.run([sys.executable, '-m', 'pip', 'install', 'rich', 'Pillow'], 
                         check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            print("✓ Libraries installed! Please run the script again.")
            sys.exit(0)
        except:
            print("❌ Failed to install libraries. Please run: pip install rich Pillow")
            sys.exit(1)
    
    from rich.console import Console
    from rich.progress import Progress, SpinnerColumn, BarColumn, TextColumn, TimeRemainingColumn
    from rich.table import Table
    from rich.panel import Panel
    from rich import box
    
    console = Console()
    
    # Header
    console.print()
    console.print(Panel.fit(
        "[bold cyan]Image to WebP Converter[/bold cyan]\n"
        "[dim]Optimizing images for MadQFF'25 Website[/dim]",
        border_style="cyan"
    ))
    console.print()
    
    # Define directories to convert
    directories_to_convert = [
        ("Fall Fest Graphics/Illustration Exports", 90),
        ("Fall Fest Graphics/Illustration Exports/Illustration Crops", 85),
        ("Fall Fest Graphics/Badge", 85),
        ("Fall Fest Graphics/Emojis", 80),
        ("logos", 85),
        ("profiles", 85),
        (".", 85)
    ]
    
    # Scan for files
    console.print("[cyan]📁 Scanning directories...[/cyan]")
    files_to_convert = scan_directories(directories_to_convert)
    
    if not files_to_convert:
        console.print("[yellow]⚠[/yellow] No images found to convert!")
        sys.exit(0)
    
    console.print(f"[green]✓[/green] Found {len(files_to_convert)} images to convert\n")
    
    # Conversion statistics
    stats = {
        'total': len(files_to_convert),
        'converted': 0,
        'failed': 0,
        'total_original_size': 0,
        'total_webp_size': 0,
    }
    
    conversion_results = []
    
    # Convert images with progress bar
    with Progress(
        SpinnerColumn(),
        TextColumn("[progress.description]{task.description}"),
        BarColumn(),
        TextColumn("[progress.percentage]{task.percentage:>3.0f}%"),
        TimeRemainingColumn(),
        console=console
    ) as progress:
        
        task = progress.add_task("[cyan]Converting images...", total=len(files_to_convert))
        
        for img_path, directory, quality in files_to_convert:
            progress.update(task, description=f"[cyan]Converting {img_path.name}...")
            
            success, original_size, webp_size, reduction, output_path = convert_to_webp(
                img_path, 
                output_directory=directory if directory != '.' else None, 
                quality=quality
            )
            
            if success:
                stats['converted'] += 1
                stats['total_original_size'] += original_size
                stats['total_webp_size'] += webp_size
                conversion_results.append({
                    'file': img_path.name,
                    'directory': directory,
                    'output': output_path,
                    'original': original_size,
                    'webp': webp_size,
                    'reduction': reduction,
                    'status': '✓'
                })
            else:
                stats['failed'] += 1
                conversion_results.append({
                    'file': img_path.name,
                    'directory': directory,
                    'output': 'Failed',
                    'original': 0,
                    'webp': 0,
                    'reduction': 0,
                    'status': '✗'
                })
            
            progress.advance(task)
    
    console.print()
    
    # Create results table
    table = Table(title="Conversion Results", box=box.ROUNDED, show_header=True, header_style="bold cyan")
    table.add_column("Status", style="dim", width=6)
    table.add_column("File", style="cyan")
    table.add_column("Output Location", style="yellow")
    table.add_column("Original", justify="right")
    table.add_column("WebP", justify="right")
    table.add_column("Saved", justify="right", style="green")
    
    for result in conversion_results[:10]:  # Show first 10
        status_style = "green" if result['status'] == '✓' else "red"
        output_display = result['output'] if result['status'] == '✓' else "Failed"
        if result['status'] == '✓':
            # Show relative path in a compact form
            output_parts = Path(output_display).parts
            if len(output_parts) > 2:
                output_display = f".../{'/'.join(output_parts[-2:])}"
        
        table.add_row(
            f"[{status_style}]{result['status']}[/{status_style}]",
            result['file'][:25] + "..." if len(result['file']) > 25 else result['file'],
            output_display[:35] + "..." if len(output_display) > 35 else output_display,
            f"{result['original']:.1f} KB" if result['original'] > 0 else "N/A",
            f"{result['webp']:.1f} KB" if result['webp'] > 0 else "N/A",
            f"-{result['reduction']:.1f}%" if result['reduction'] > 0 else "N/A"
        )
    
    if len(conversion_results) > 10:
        table.add_row("...", "...", "...", "...", "...", "...")
    
    console.print(table)
    console.print()
    
    # Summary statistics
    total_reduction = ((stats['total_original_size'] - stats['total_webp_size']) / stats['total_original_size'] * 100) if stats['total_original_size'] > 0 else 0
    
    summary = Table.grid(padding=1)
    summary.add_column(style="cyan", justify="right")
    summary.add_column(style="bold")
    
    summary.add_row("Total Images:", f"{stats['total']}")
    summary.add_row("Successfully Converted:", f"[green]{stats['converted']}[/green]")
    summary.add_row("Failed:", f"[red]{stats['failed']}[/red]")
    summary.add_row("Original Size:", f"{stats['total_original_size']:.1f} KB")
    summary.add_row("WebP Size:", f"{stats['total_webp_size']:.1f} KB")
    summary.add_row("Total Saved:", f"[bold green]{stats['total_original_size'] - stats['total_webp_size']:.1f} KB ({total_reduction:.1f}%)[/bold green]")
    
    console.print(Panel(summary, title="[bold]Summary", border_style="green", box=box.ROUNDED))
    console.print()
    
    # Show directory structure info
    console.print("[cyan]📂 WebP files saved in subdirectories:[/cyan]")
    console.print("[dim]  • Fall Fest Graphics/Illustration Exports/webp/[/dim]")
    console.print("[dim]  • Fall Fest Graphics/Illustration Exports/Illustration Crops/webp/[/dim]")
    console.print("[dim]  • Fall Fest Graphics/Badge/webp/[/dim]")
    console.print("[dim]  • Fall Fest Graphics/Emojis/webp/[/dim]")
    console.print("[dim]  • logos/webp/[/dim]")
    console.print("[dim]  • profiles/webp/[/dim]")
    console.print("[dim]  • webp/ (root files)[/dim]")
    console.print()
    
    console.print("[green]✓[/green] [bold]Conversion complete![/bold]")