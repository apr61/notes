---
title: Bitwise Operators
date: 06/09/2026
---


| Operator | Name        | Example  | Description                         |
| -------- | ----------- | -------- | ----------------------------------- |
| `&`      | Bitwise AND | `a & b`  | Sets bit to 1 if both bits are 1    |
| `\|`     | Bitwise OR  | `a \| b` | Sets bit to 1 if either bit is 1    |
| `^`      | Bitwise XOR | `a ^ b`  | Sets bit to 1 if bits are different |
| `~`      | Bitwise NOT | `~a`     | Inverts all bits                    |
| `<<`     | Left Shift  | `a << 2` | Shifts bits to the left             |
| `>>`     | Right Shift | `a >> 2` | Shifts bits to the right            |


### Set a bit

```c
num |= (1 << n);
```

### Clear a bit

```c
num &= ~(1 << n);
```

### Toggle a bit

```c
num ^= (1 << n);
```

### Check a bit

```c
if(num & (1 << n))
{
    // Bit is set as 1
}
```

