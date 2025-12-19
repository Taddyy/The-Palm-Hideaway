#!/usr/bin/env python3
"""Local development server for The Palm Hideaway website."""

import argparse
import http.server
import logging
import os
import socketserver
import sys
import webbrowser
from pathlib import Path
from typing import Optional

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[
        logging.FileHandler("http_server.log"),
        logging.StreamHandler(sys.stdout),
    ],
)

logger = logging.getLogger(__name__)


class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """Custom request handler with improved logging."""

    def log_message(self, format: str, *args: tuple) -> None:
        """Override to use logger instead of stderr."""
        logger.info(f"{self.address_string()} - {format % args}")

    def end_headers(self) -> None:
        """Add CORS headers for local development."""
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        super().end_headers()


def start_server(
    port: int = 8000,
    directory: Optional[Path] = None,
    open_browser: bool = True,
) -> None:
    """Start the local development server."""
    if directory is None:
        directory = Path.cwd()
    else:
        directory = Path(directory)

    if not directory.exists():
        logger.error(f"Directory {directory} does not exist!")
        sys.exit(1)

    # Change to the directory to serve files from
    os.chdir(directory)

    handler = CustomHTTPRequestHandler
    httpd = socketserver.TCPServer(("", port), handler)

    url = f"http://localhost:{port}"
    logger.info(f"Starting server at {url}")
    logger.info(f"Serving directory: {directory.absolute()}")
    logger.info("Press Ctrl+C to stop the server")

    if open_browser:
        # Wait a moment for server to start, then open browser
        import threading

        def open_browser_delayed() -> None:
            import time

            time.sleep(1)
            webbrowser.open(url)

        browser_thread = threading.Thread(target=open_browser_delayed)
        browser_thread.daemon = True
        browser_thread.start()

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        logger.info("\nShutting down server...")
        httpd.shutdown()
        logger.info("Server stopped.")


def main() -> None:
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description="Start a local development server for The Palm Hideaway website"
    )
    parser.add_argument(
        "--port",
        type=int,
        default=8000,
        help="Port number to run the server on (default: 8000)",
    )
    parser.add_argument(
        "--directory",
        type=str,
        default=None,
        help="Directory to serve files from (default: current directory)",
    )
    parser.add_argument(
        "--no-browser",
        action="store_true",
        help="Don't automatically open browser",
    )

    args = parser.parse_args()

    directory = Path(args.directory) if args.directory else None

    try:
        start_server(
            port=args.port,
            directory=directory,
            open_browser=not args.no_browser,
        )
    except OSError as e:
        if "Address already in use" in str(e) or "Only one usage" in str(e):
            logger.error(
                f"Port {args.port} is already in use. "
                f"Try a different port with --port option."
            )
        else:
            logger.error(f"Error starting server: {e}")
        sys.exit(1)
    except Exception as e:
        logger.error(f"Unexpected error: {e}", exc_info=True)
        sys.exit(1)


if __name__ == "__main__":
    main()

