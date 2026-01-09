#!/bin/bash

# Get changed files (staged after git add)
CHANGED_FILES=$(git diff --cached --name-only 2>/dev/null)

# If no staged files, check if there are any changes at all
if [ -z "$CHANGED_FILES" ]; then
  UNSTAGED=$(git diff --name-only 2>/dev/null)
  if [ -z "$UNSTAGED" ]; then
    echo "No changes to commit"
    exit 1
  fi
  # If there are unstaged files, they should have been added by git add .
  # So check again after a moment
  CHANGED_FILES=$(git diff --cached --name-only 2>/dev/null)
fi

# If still no changes, exit
if [ -z "$CHANGED_FILES" ]; then
  echo "No changes to commit"
  exit 1
fi

# Count different types of changes
MODIFIED_COUNT=$(echo "$CHANGED_FILES" | wc -l | tr -d ' ')
ADDED_COUNT=$(git diff --cached --name-only --diff-filter=A 2>/dev/null | wc -l | tr -d ' ')
DELETED_COUNT=$(git diff --cached --name-only --diff-filter=D 2>/dev/null | wc -l | tr -d ' ')

# Get file extensions/types
FILE_TYPES=$(echo "$CHANGED_FILES" | grep -o '\.[^.]*$' | sed 's/^\.//' | sort | uniq -c | sort -rn | head -3 | awk '{print $2}' | tr '\n' ',' | sed 's/,$//')

# Get main directories/categories
DIRS=$(echo "$CHANGED_FILES" | cut -d'/' -f1-2 | sort | uniq | grep -v '^$' | head -3 | tr '\n' ',' | sed 's/,$//')

# Build commit message based on actual changes
MESSAGE=""

if [ "$ADDED_COUNT" -gt 0 ]; then
  MESSAGE="Add: $ADDED_COUNT new file(s)"
elif [ "$DELETED_COUNT" -gt 0 ]; then
  MESSAGE="Remove: $DELETED_COUNT file(s)"
elif [ "$MODIFIED_COUNT" -gt 0 ]; then
  MESSAGE="Update: $MODIFIED_COUNT file(s)"
fi

# Add file types if available
if [ -n "$FILE_TYPES" ] && [ "$MODIFIED_COUNT" -lt 20 ]; then
  MESSAGE="${MESSAGE} ($FILE_TYPES)"
fi

# Add directory info if available and not too many files
if [ -n "$DIRS" ] && [ "$MODIFIED_COUNT" -lt 15 ]; then
  MESSAGE="${MESSAGE} in $DIRS"
fi

# Add timestamp
MESSAGE="${MESSAGE} - $(date '+%Y-%m-%d %H:%M:%S')"

echo "$MESSAGE"
