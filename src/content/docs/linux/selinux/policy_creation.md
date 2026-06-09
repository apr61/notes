---
title: Policy creation
date: 08/06/2026
---

## Policy creation

### Custom module policy

We will be creating a custom module for a application and help it run in it's own domain.

```c++
// my_app.cpp

int main()
{
}
```

```sh
# my_app.te

# 1. Define a loadable module
# module <moudle_name> <module_version>;
module my_app 1.0;

# 2. import required modules using the 'require'

require {
	attribute exec_type;
	attribute file_type;
	attribute domain;
	type unconfined_t;
	class process { transition fork sigchld };
	class file { execute getattr open read map entrypoint };
	
	role unconfined_r;
}

# Without a require block, the compiler doesn't know what `unconfined_t` is.

# 3. Type declaration

# type module_type_t;
# This will become the process domain
type my_app_t;


# 4. Executable type declaration

# type executable_type_t;
# This will be used for executable file
type my_app_exec_t;

# 5. type attribute
# An attribute is a group.

# Let's say we have an attribute
# 	Attribute
#		exec_type has (bin_t, ssh_exec_t, httpd_exec_t, ...)
# We need to tell selinux that my_app_exec_t 
# 	belongs to executable-file family.

typeattribute my_app_exec_t exec_type;

# Define the my_app_exec_t as a file_type
typeattribute my_app_exec_t file_type;

# Define my_app_t as a domain
typeattribute my_app_t domain;

# 6. Allow rules

# 6.1. Allow my_app_t to perform process operations on itself

allow my_app_t self:process { fork sigchld };

# 6.2. Allow my_app_t to access files labeled my_app_exec_t
# getattr => Reading metadata (stat(), ls -l)
# open => opening the file
# read => reading the file
# execute => allows executing the binary
# map => allows memory mapping

allow unconfined_t my_app_exec_t:file { getattr open read execute map };
allow my_app_t my_app_exec_t:file { getattr open read execute map };

# 7. Domain transisition

# 7.1 Create type_transition rule

type_transition unconfined_t my_app_exec_t:process my_app_t;

# When:
#  unconfined_t
#       executes
#   my_app_exec_t
#       create the new process in
#   my_app_t

# Without this rule, my_app runs in unconfined_t domain

# 7.2 Give transition permission

allow unconfined_t my_app_t:process transition;

# Allow unconfined_t to transition into my_app_t
# Permission to change the domain

# 7.3 Allow entrypoint of my_app_exec_t to my_app_t

allow my_app_t my_app_exec_t : file entrypoint;

# 8. Allow unconfined_r to use processes of type my_app_t

role unconfined_r types my_app_t;
```

```sh
# my_app.fc

/home/pradeep/selinux/my_app/my_app -- system_u:object_r:my_app_exec_t:s0
```

```sh
#Makefile

MODULE=my_app

all:
	make -f /usr/share/selinux/devel/Makefile
```

### Writing allow rule

The basic allow rule format will be 

```sh
allow SOURCE TARGET:CLASS PERMISSIONS;
```

(or)

```sh
allow source_type destination_type:object_class permissions;
```

```sh
allow  my_app_t self:process { fork sigchild };
```

### Install policy

We can install a policy using the `semodule` utility.

```sh
sudo semodule -i my_domain.pp
```

### Changing the label of executable

We can change the context of the file using the `semanage` and `restorecon` utitlty.

#### Mapping the file with exec type

```sh
sudo semanage -a -t my_app_exec_t my_app
```

```sh
pradeep@fedora:~/selinux/my_app$ ls -Z my_app
unconfined_u:object_r:user_home_t:s0 my_app
pradeep@fedora:~/selinux/my_app$ 
pradeep@fedora:~/selinux/my_app$ 
pradeep@fedora:~/selinux/my_app$ sudo semanage fcontext -a -t my_app_exec_t my_app
pradeep@fedora:~/selinux/my_app$ 
pradeep@fedora:~/selinux/my_app$ ls -Z my_app
unconfined_u:object_r:user_home_t:s0 my_app
pradeep@fedora:~/selinux/my_app$ 
```

#### Restoring the security context

```sh
sudo restorecon -v my_app
```

```sh
pradeep@fedora:~/selinux/my_app$ sudo restorecon -v my_app
Relabeled /home/pradeep/selinux/my_app/my_app from unconfined_u:object_r:user_home_t:s0 to unconfined_u:object_r:my_app_exec_t:s0
pradeep@fedora:~/selinux/my_app$ 
pradeep@fedora:~/selinux/my_app$ ls -Z my_app
unconfined_u:object_r:my_app_exec_t:s0 my_app
pradeep@fedora:~/selinux/my_app$ 
```

### SE Linux AVC audit

#### Read AVC denials or policy violations

```sh
ausearch -m AVC -ts recent | audit2why
```