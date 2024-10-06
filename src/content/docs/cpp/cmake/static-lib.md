---
title: Static Library using cmake
date: 06/10/2024
---

Static library example using cmake

```
# CMakeLists.txt

cmake_minimum_required(VERSION 2.8...3.1)

project("MyMath")

# Specify the C++ standard
set(CMAKE_CXX_STANDARD 11)
set(CMAKE_CXX_STANDARD_REQUIRED True)


# Library creation - STATIC library
add_library(${PROJECT_NAME} STATIC)

# PROJECT sources
set(${PROJECT_NAME}_SRC_FILES
  ${CMAKE_CURRENT_SOURCE_DIR}/src/my_math.cpp
)

# Target sources
target_sources(${PROJECT_NAME}
  PRIVATE
  ${${PROJECT_NAME}_SRC_FILES}
)

# Include directories
target_include_directories(${PROJECT_NAME}
  PRIVATE
  ${CMAKE_CURRENT_SOURCE_DIR}/inc
)

# installation path
if(CMAKE_INSTALL_PREFIX_INITIALIZED_TO_DEFAULT)
  message(STATUS
    "CMAKE_INSTALL_PREFIX is not set \n"
    "Default value: ${CMAKE_INSTALL_PREFIX}\n"
    "Will be set to ${CMAKE_CURRENT_SOURCE_DIR}/install"
  )
  set(CMAKE_INSTALL_PREFIX
    "/usr/"
    CACHE PATH "Where the library will be installed to" FORCE
  )
endif()

# Public headers
set(public_headers
  ${CMAKE_CURRENT_SOURCE_DIR}/inc/my_math.h
)

# Target properties
set_target_properties(${PROJECT_NAME} PROPERTIES PUBLIC_HEADER "${public_headers}")

# Install
install(TARGETS ${PROJECT_NAME}
  EXPORT "${PROJECT_NAME}Targets"
  PUBLIC_HEADER DESTINATION ${CMAKE_INSTALL_PREFIX}/include/${PROJECT_NAME}
  INCLUDES DESTINATION ${CMAKE_INSTALL_PREFIX}/include
)

```

#### Usage in test app

```
# CMakeLists.txt

cmake_minimum_required(VERSION 3.1)

project(MyMathTest)


find_library(MyMath NAMES MyMath)

set(${PROJECT_NAME}_SRC_FILES
	${CMAKE_CURRENT_SOURCE_DIR}/src/main.cpp
)

add_executable(${PROJECT_NAME}
	${${PROJECT_NAME}_SRC_FILES}	
)

include_directories(
	"/usr/include/MyMath"	
)

target_link_libraries(
	${PROJECT_NAME}
	PRIVATE
	MyMath	
)

```