# Contributing to Booking Bridge

Thank you for your interest in contributing to Booking Bridge! We welcome contributions from the community and are grateful for any help you can provide.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Development Workflow](#development-workflow)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)

## Code of Conduct

This project adheres to a [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally
   ```bash
   git clone https://github.com/YOUR_USERNAME/booking-bridge.git
   cd booking-bridge
   ```
3. Install dependencies
   ```bash
   npm install
   ```
4. Set up your Firebase project and create a `.env` file (see README.md)
5. Create a branch for your changes
   ```bash
   git checkout -b feature/your-feature-name
   ```

## How to Contribute

### Types of Contributions

We welcome many types of contributions, including:

- **Bug fixes**: Find and fix bugs in the codebase
- **New features**: Add new functionality to the application
- **Documentation**: Improve or expand documentation
- **UI/UX improvements**: Enhance the user interface and experience
- **Performance optimizations**: Make the app faster and more efficient
- **Tests**: Add or improve test coverage
- **Accessibility**: Improve accessibility for all users

### Good First Issues

Look for issues labeled `good first issue` if you're new to the project. These are typically smaller, well-defined tasks that are perfect for getting started.

## Development Workflow

1. **Create a branch** for your work
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following our coding standards

3. **Test your changes** locally
   ```bash
   npm start
   ```

4. **Commit your changes** with a meaningful commit message
   ```bash
   git commit -m "feat: add new feature description"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request** on GitHub

## Pull Request Process

1. **Update documentation** if you're adding or changing features
2. **Add tests** if applicable
3. **Ensure the app runs** without errors locally
4. **Update the README.md** if needed
5. **Fill out the PR template** completely
6. **Request a review** from maintainers
7. **Address any feedback** from reviewers

### PR Checklist

Before submitting your PR, make sure:

- [ ] Code follows the project's coding standards
- [ ] Commits follow our commit message guidelines
- [ ] All tests pass (when tests are implemented)
- [ ] Documentation is updated
- [ ] No console errors or warnings
- [ ] Works on mobile and desktop
- [ ] Accessible (keyboard navigation, screen readers)

## Coding Standards

### JavaScript/React

- Use functional components with hooks
- Use `const` and `let` instead of `var`
- Use arrow functions for callbacks
- Destructure props and state
- Keep components small and focused (< 200 lines ideally)
- Use meaningful variable and function names
- Add comments for complex logic
- Use `React.memo` for optimization when appropriate
- Use `useCallback` and `useMemo` to prevent unnecessary re-renders

### File Organization

- One component per file
- Group related components in folders
- Use index files for cleaner imports
- Keep utility functions in separate files

### Styling

- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Use consistent spacing and sizing
- Maintain accessibility (contrast ratios, focus states)
- Group related classes together

### Example Component

```jsx
import React, { memo, useCallback } from 'react';
import { Link } from 'react-router-dom';

const ExampleComponent = ({ title, onAction }) => {
  const handleClick = useCallback(() => {
    onAction();
  }, [onAction]);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
      <button
        onClick={handleClick}
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
      >
        Action
      </button>
    </div>
  );
};

export default memo(ExampleComponent);
```

## Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Format

```
type(scope): subject

body

footer
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, semicolons, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks, dependency updates

### Examples

```
feat(dashboard): add analytics chart component

Add a new chart component to display link click analytics
over time using Chart.js library.

Closes #123
```

```
fix(auth): resolve login redirect loop

Users were getting stuck in a redirect loop after login.
Fixed by checking auth state before redirecting.

Fixes #456
```

## Reporting Bugs

### Before Submitting a Bug Report

1. **Check existing issues** to avoid duplicates
2. **Test with the latest version** to see if it's already fixed
3. **Gather information** about the bug

### Bug Report Template

```markdown
**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
 - OS: [e.g. iOS, Windows, macOS]
 - Browser [e.g. chrome, safari]
 - Version [e.g. 22]

**Additional context**
Add any other context about the problem here.
```

## Suggesting Features

### Before Suggesting a Feature

1. **Check if it's already been suggested** in issues
2. **Consider if it fits the project's goals**
3. **Think about implementation**

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
A clear description of what the problem is. Ex. I'm always frustrated when [...]

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Other solutions or features you've considered.

**Additional context**
Any other context, mockups, or screenshots about the feature request.

**Would you be willing to implement this feature?**
Let us know if you'd like to contribute code for this feature.
```

## Questions?

If you have questions about contributing, feel free to:

- Open an issue with the `question` label
- Reach out to maintainers
- Check existing documentation

## License

By contributing to Booking Bridge, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Booking Bridge! 🎉
