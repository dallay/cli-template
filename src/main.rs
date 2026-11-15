use clap::{Parser, Subcommand};
use cli_template::greet;

#[derive(Parser)]
#[command(name = "cli-template")]
#[command(version, about = "A Rust CLI template project", long_about = None)]
struct Cli {
    #[command(subcommand)]
    command: Option<Commands>,
}

#[derive(Subcommand)]
enum Commands {
    /// Greets someone by name
    Greet {
        /// Name of the person to greet
        #[arg(short, long)]
        name: String,
    },
}

#[tokio::main]
async fn main() {
    let cli = Cli::parse();

    match cli.command {
        Some(Commands::Greet { name }) => {
            let message = greet(&name);
            println!("{}", message);
        }
        None => {
            println!("No command specified. Use --help for usage information.");
        }
    }
}
