//! {{PROJECT_NAME}} - {{DESCRIPTION}}
//!
//! This is a template for Rust CLI tools.

/// Greets someone by name.
///
/// # Examples
///
/// ```
/// let message = {{CARGO_NAME}}::greet("World");
/// assert_eq!(message, "Hello, World!");
/// ```
pub fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_greet() {
        let message = greet("World");
        assert_eq!(message, "Hello, World!");
    }

    #[test]
    fn test_greet_empty() {
        let message = greet("");
        assert_eq!(message, "Hello, !");
    }
}
