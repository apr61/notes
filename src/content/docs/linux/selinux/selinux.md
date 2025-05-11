---
title: SE Linux
date: 27/04/2025
---


## SELinux - Security Enhanced Linux

SELinux (Security-Enhanced Linux) is a security module integrated into the Linux kernel that provides a mechanism for enforcing mandatory access control (MAC) policies

SELinux provides an additional layer of system security.

SELinux is implemented based on MAC.

SELinux is as simple as this question : ```May <subject> do <action> to <object> ?```

**Example** - May a web server access files in user's home directories?

### DAC - Discretionary Access Control

The stardard access policy based on the user, group and other permissions.

### MAC - Mandatory Access Control

It is a administratively set policy around access. Even if DAC settings are changed on home directory, DAC policy will prevent another user or process from accessing the directory.

**Note** : SELinux policy rules are checked after DAC rules. SELinux policy rules are not used, if DAC rules deny access first. No denail is logged if DAC rules prevent the access first.

Every process and system resource has a special security label called an ***SELinux context***.

### SELinux context

SELinux context sometimes referred as SELinux identifier which abstracts way system level details and focuses on security properties of the entity.

The SELinux policy uses this contexts in a series of rules which defines which process can interact with each other and various system resources.

The security context is comprised of four fields
1. user
2. role
3. type
4. level

#### user

SELinux users can have multiple roles that can reach upto multiple types.

Three users can be found on a system **system_u**, **user_u** and **root**.

The **user_u** is the default SELinux user for a logged in user on a system.

The **system_u** is the default user started during boot up process. ie., they were never started by the user.

The **root** is the SELinux user that you get when you login as root in the console.

- In targeted policies the user component is not really important. It is used in **MLS** and **Strict policy machines**.
- On a file the user component specifies the SELinux user that created the file.
- On initial files are labeled as **system_u**. Even if we relabel they will get set back to **system_u**.
- All SELinux users end with a "_u" except root. If we want to map a Linux user to SELinux user, you would create a SELinux user name with the same name as Linux user becuase of this root user doesn't end up with "_u".

#### role 

This is the second field.

The role field on a file is always object_r, and really has no meaning other than placeholder.

On a process a role can be seen as **system_r** or **sysadm_r**. Roles are used to group security types. We can specify in policy which roles are able to execute which types.

This is the basis of Role Based Access Control (RABC) in SELinux. It is mostly used in MLS and Strict policy.

#### type 

This is the third field.

This is the heart of SELinux Type Enforcement. 
Most of the policy rules in SELinux revolve around what subject types have what access to which object types.

#### level

This is the forth field. The level is used for MLS (Multi Level Security). 

This field can contain `:`. The syntax for this field can look like **s0-s15:c1,c2**. 

Most files are labeled as **s0** or **system low**. 

On targeted or Strict policy machines **s0** translates to "", so almost all files will not show forth field.

#### Security context Example

