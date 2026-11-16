use clap::{Parser, Subcommand};

#[derive(Parser)]
#[command(name = "cli-template")]
#[command(version, about = "A Rust CLI template project", long_about = None)]
struct Cli {
    #[command(subcommand)]
    command: Option<Commands>,
}

#[derive(Subcommand)]
enum Commands {
    /// Display version and system information
    Version,

    /// Greets someone by name
    Greet {
        /// Name of the person to greet
        #[arg(short, long)]
        name: String,
    },
}

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt()
        .with_env_filter(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| tracing_subscriber::EnvFilter::new("info")),
        )
        .init();

    let cli = Cli::parse();

    match cli.command {
        Some(Commands::Version) => {
            tracing::info!("Displaying version information");
            println!("Name: {}", env!("CARGO_PKG_NAME"));
            println!("Version: {}", env!("CARGO_PKG_VERSION"));
            println!("Author: {}", env!("CARGO_PKG_AUTHORS"));
            println!("Target triple: {}", std::env::consts::ARCH);
            println!("OS: {}", std::env::consts::OS);
        }
        Some(Commands::Greet { name }) => {
            tracing::info!("Greeting: {}", name);
            let message = cli_template::greet(&name);
            println!("{}", message);
        }
        None => {
            println!("No command specified. Use --help for usage information.");
        }
    }
}
