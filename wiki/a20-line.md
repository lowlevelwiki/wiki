---
title: "A20 Line"
---

The **A20 Line** or **Address Line 20** is used to transmit the 21st bit on an
x86 CPUs address bus.

The Intel 80186 processor, and many before, had 20 address lines. With these,
the processor could access up to 2<sup>20</sup> bytes or 1 MiB, but the
internal registers of the 186 only had 16 bits. To access the full 1 MiB of
address space, a memory reference also included a _segment number_ which made
the address calculation look like this: _segment_ × 16 + _offset_. Because of
this there are many ways to reference the same address. For example
`F000:FFFF`, `FFFF:000F` and `F800:7FFF` all reference the byte at
`0x000FFFFF`. If referenced in the last way and the offset was incremented with
one it would translate to the physical address `0x00100000`, but because the
processor didn't have enough address lines it would flip over to `0x00000000`.
Some programs relied on this behavior and would fail without it.

When IBM designed the PC AT machine in 1984 they decided to use the new
80286 which could address up to 16 MiB of memory in protected mode. However,
the processor was supposed to emulate the 80186's behavior in real mode, so it
could run operating systems and programs that were not written for the new
protected mode. The issue was that the 286 didn't force the A20 line to be zero
so addresses would no longer flip over.

The problem then needed to be fixed and IBM chose to put a logic gate on the A20
line between the processor and address bus. The BIOS then disables it before
transferring control to the operating system. This was named the _A20 gate_.

## A20 Gate

The A20 gate is the logic gate controlling the A20 line. It is route through
the 8042 keyboard controller because it had a spare pin. Today this looks like
an odd choice bit back then, but at the time computers weren't as
standardized compared to today.

## Enabling the A20 Line

To enable the A20 line you have to use port I/O to communicate with the 8042.
Here is the flowchart for enabling it:

1. Disable interrupts
2. Wait until the keyboard controller buffer is empty
3. Disable the keyboard controller
4. Wait until the keyboard controller buffer is empty
5. Request status of the keyboard controllers output pins
6. Wait until the keyboard controller buffer is empty
7. Read the byte from the data port and save it
8. Wait until the keyboard controller buffer is empty
9. Request to write to the output pin status
10. Wait until the keyboard controller buffer is empty
11. Send the saved byte ORed by 2 (the A20 gate bit)
12. Wait until the keyboard controller buffer is empty
13. Enable the keyboard controller
14. Enable interrupts (optional)

The data port is `0x60`, the command port is `0x64`, the disable command is
`0xAD`, the enable command is `0xAE`, the "read control output port" command is
`0xD0` and the "write control output port" command is `0xD1`. You can find an
assembly example
[here](https://github.com/zinix-org/lime-boot/blob/f5ebc3af3e3a9584550d430523175b1f1779c212/src/stage2/entry.asm#L81)
(GPL licensed).

Sources:

- [www.mega-tokyo.com/os/os-faq-memory.html#enable_a20](https://web.archive.org/web/20030219234256/http://www.mega-tokyo.com/os/os-faq-memory.html#enable_a20) (Internet Archive)
