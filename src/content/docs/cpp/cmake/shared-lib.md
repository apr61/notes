---
title: Shared Library using cmake
date: 06/10/2024
---

Shared library example using C++

### CMakeLists.txt

```
# CMakeLists.txt

cmake_minimum_required(VERSION 2.8...3.8)

project(mymath)

add_library(${PROJECT_NAME} SHARED)

# Project sources
set(${PROJECT_NAME}_SRC_FILES
	${CMAKE_CURRENT_SOURCE_DIR}/src/my_math.cpp	
)

# GNUInstallDirs for CMAKE_INSTALL_*DIR

include(GNUInstallDirs)

# LIB versions
set(MAJOR_VERSION 0)
set(MINOR_VERSION 0)
set(PATCH_VERSION 1)

# include directories
include_directories(
	${CMAKE_CURRENT_SOURCE_DIR}/inc	
)

# public headers
set(public_headers
	${CMAKE_CURRENT_SOURCE_DIR}/inc/my_math.h	
)

# Target sources
target_sources(${PROJECT_NAME}
	PRIVATE
	${${PROJECT_NAME}_SRC_FILES}
)

# Target properties
set_target_properties(${PROJECT_NAME} PROPERTIES PUBLIC_HEADER "${public_headers}")
set_target_properties(${PROJECT_NAME} PROPERTIES 
	VERSION ${MAJOR_VERSION}.${MINOR_VERSION}.${PATCH_VERSION}
	SOVERSION ${MAJOR_VERSION}
)

# Package config
configure_file(${PROJECT_NAME}.pc.in ${PROJECT_NAME}.pc @ONLY)

# install
install(TARGETS ${PROJECT_NAME}
	LIBRARY DESTINATION ${CMAKE_INSTALL_LIBDIR}
	PUBLIC_HEADER DESTINATION ${CMAKE_INSTALL_INCLUDEDIR}	
)

# install config file

install(FILES ${CMAKE_BINARY_DIR}/${PROJECT_NAME}.pc DESTINATION ${CMAKE_INSTALL_DATAROOTDIR}/pkgconfig)

```

### Package configuaration

```
# mymath.pc.in

prefix=@CMAKE_INSTALL_PREFIX@
exec_prefix=@CMAKE_INSTALL_PREFIX@
libdir=${exec_prefix}/@CMAKE_INSTALL_LIBDIR@
includedir=${prefix}/@CMAKE_INSTALL_INCLUDEDIR@

Name: MyMath
Description: My Math library
Version: 0.0.1

Requires:
Libs: -L${libdir} -lmymath
Cflags: -I${includedir}

```

#### Usage in test app

```
cmake_minimum_required(VERSION 3.1)

project(MyMathTest)

find_package(PkgConfig REQUIRED)

pkg_check_modules(MYMATH REQUIRED mymath)

include_directories(
	${MYMATH_INCLUDE_DIRS}	
)

set(${PROJECT_NAME}_SRC_FILES
	${CMAKE_CURRENT_SOURCE_DIR}/src/main.cpp
)

add_executable(${PROJECT_NAME}
	${${PROJECT_NAME}_SRC_FILES}	
)

target_link_libraries(
	${PROJECT_NAME}
	PRIVATE
	${MYMATH_LIBRARIES}	
)
```