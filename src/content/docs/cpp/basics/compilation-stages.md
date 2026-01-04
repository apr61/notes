---
title: Compilation Stages
date: 04/01/2026
---

The process of compilation in C++ can be divided into four primary stages
1. Preprocessor
2. Translator
3. Assembler
4. Linker

## Preprocessor
The first stage is the preprocessing of source code. In this the derivates that start with a `#` symbol, like `#inlcude`, `#define` and `#if` are handled. The included header files are expanded, macros are replaced and conditional compilation statements are processed.

- The preprocessed o/p files can be generated using the `-E` compilation flag.

## Translator
The second stage is the actual compilation of the preprocessed source code. 
- The compiler translates the modified source code into an intermediate representation which is usually specific to the targeted processor. 
- The translator performs below steps
    1. syntax check
    2. symantic analysis 
    3. producing error messages for any issue encounter in the source code

## Assembler
The third stage is converting the compiler's intermediate representation into assembly language. Assemblers convert this assembly code into object code.

## Linker 
The final stage is the linking of the object code with necessary libraries and other object files. The linker perform
1. Merges multiple object files and libraries
2. resolves external references from other modules or libraries
3. Allocates memory address for functions and variables
4. Generates an executable that can be run on the target platform
