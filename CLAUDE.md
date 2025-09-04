# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Kannada Quiz Application for 3rd graders built with React, TypeScript, and Vite. The application supports both Kannada and Hindi language quizzes with multiple question types including vowels/consonants, translations, numbers, and language-specific features like gender and noun/verb identification.

## Development Commands

- `npm run dev` - Start development server (Vite)
- `npm run build` - Build for production 
- `npm run lint` - Run ESLint for code quality checks
- `npm run preview` - Preview production build locally

## Architecture Overview

### Core Application Structure
- **Main Entry**: `src/main.tsx` - Application root with React StrictMode and ThemeProvider
- **App Component**: `src/App.tsx` - Main application logic with state management for quiz flow
- **Game States**: subject-selection → settings → quiz → results

### Key Directories
- `src/components/` - React components (QuestionCard, QuizResults, SubjectSelector, etc.)
- `src/contexts/` - React contexts (ThemeContext for dark/light mode)
- `src/types/` - TypeScript type definitions (QuizData, Question, QuizState)
- `src/utils/` - Business logic (QuizGenerator, HindiQuizGenerator classes)
- `src/data/` - JSON data files (test.json for Kannada, hindi.json for Hindi)

### Quiz Generation System
Two separate quiz generators handle different languages:
- `QuizGenerator` (Kannada) - Handles vowels, consonants, translations, numbers
- `HindiQuizGenerator` - Handles gender, meanings, noun/verb identification, singular/plural

### State Management
- Application state managed through React useState hooks in App.tsx
- Quiz state includes: currentQuestion, score, questions array, UI flags
- Theme state managed via React Context (ThemeContext)

### Question Types
- **Kannada**: before/after letters, kannada-to-english, english-to-kannada, number conversions
- **Hindi**: gender identification, meanings, noun/verb selection, singular/plural

## Tech Stack
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with dark/light theme support
- **Icons**: Lucide React
- **Linting**: ESLint with TypeScript and React plugins