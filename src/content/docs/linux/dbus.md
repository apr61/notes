---
title: Dbus
date: 09/03/2025
---

D-Bus is an inter-process communication (IPC) system that allows multiple applications to communicate with each other in a structured way.

### Types of buses

1. **System bus**: Used for communication between system-wide services (eg. hardware events, system daemons).

2. **Session bus**: Used for communication between user applications in a session.


### Asynchronous Communication
 
D-Bus supports method calls, signals and property changes.

### Introspection & Object-Oriented Model

Applications expose objects with methods, properties and signals.


## Important terms

|Term|Description|
|----|-----------|
|**Bus**|A channel for message passing (system-wide or user session)|
|**Service**|A program connected to the bus with a unique name (e.g., <code>org.example.myservice</code>)|
|**Object**|Logial endpoint within a service (e.g., <code>/org/example/MyObject</code>)|
|**Interface**|A set of methods/signals/properties (e.g., <code>org.example.MyInterface</code>)|
|**Method call**|Remote function call to an object|
|**Signal**|Broadcast messages from a service (event notification)|


### Examples

#### Example 1

This is a simple GDBus server example in C.
Which exposes a function that prints some message.

```c
#include <gio/gio.h>

static void handle_method_call(GDBusConnection * conn,
                               const gchar * sender,
                               const gchar *object_path,
                               const gchar * interface_name,
                               const gchar * method_name,
                               GVariant * parameters,
                               GDBusMethodInvocation *invocation,
                               gpointer user_data)
{
    if(g_strcmp0(method_name, "sayHello") == 0)
    {
        const char * response = "Hello from GDBus service";
        g_dbus_method_invocation_return_value(invocation, g_variant_new("(s)", response));
    }
}

static const GDBusInterfaceVTable interface_vtable = {
    handle_method_call, NULL, NULL
};

static void on_bus_acquired(GDBusConnection * conn, const gchar *name, gpointer user_data)
{
    static const gchar * interface_xml = 
            "<node>"
            "   <interface name='org.example.myInterface'>"
            "       <method name='sayHello'>"
            "           <arg type='s' name='greeting' direction='out' />"
            "       </method>"
            "   </interface>"
            "</node>";
    
    GError *error = NULL;
    GDBusNodeInfo * introspection_data = g_dbus_node_info_new_for_xml(interface_xml, &error);

    g_dbus_connection_register_object(conn,
                                      "/org/example/myObject",
                                      introspection_data->interfaces[0],
                                      &interface_vtable,
                                      NULL, NULL, &error);
}

int main()
{
    GMainLoop * loop = g_main_loop_new(NULL, FALSE);

    g_bus_own_name(G_BUS_TYPE_SESSION,
                    "org.example.myService",
                    G_BUS_NAME_OWNER_FLAGS_NONE,
                    on_bus_acquired,
                    NULL,NULL,NULL,NULL);
    
    g_main_loop_run(loop);
}
```

Compile the code

```sh
gcc gdbus-server.c -o gdbus-server `pkg-config --cflags --libs gio-2.0`
```

#### Introspect usage

```sh
gdbus introspect --session --dest org.example.myService --object-path /org/example/myObject 
```

You will see the below output

```sh
node /org/example/myObject {
  interface org.freedesktop.DBus.Properties {
    methods:
      Get(in  s interface_name,
          in  s property_name,
          out v value);
      GetAll(in  s interface_name,
             out a{sv} properties);
      Set(in  s interface_name,
          in  s property_name,
          in  v value);
    signals:
      PropertiesChanged(s interface_name,
                        a{sv} changed_properties,
                        as invalidated_properties);
    properties:
  };
  interface org.freedesktop.DBus.Introspectable {
    methods:
      Introspect(out s xml_data);
    signals:
    properties:
  };
  interface org.freedesktop.DBus.Peer {
    methods:
      Ping();
      GetMachineId(out s machine_uuid);
    signals:
    properties:
  };
  interface org.example.myInterface {
    methods:
      sayHello(out s greeting);
    signals:
    properties:
  };
};
```

#### Invoke the call

```sh
gdbus call --session --dest org.example.myService --object-path /org/example/myObject --method org.example.myInterface.sayHello
```

Output

```sh
('Hello from GDBus service',)
```

#### Example 2

Update the <code>interface_xml</code> variable

```c
static const gchar * interface_xml = 
        "<node>"
        "   <interface name='org.example.myInterface'>"
        "       <method name='sayHello'>"
        "           <arg type='s' name='greeting' direction='out' />"
        "       </method>"
        "       <method name='sayWithIn'>"
        "           <arg type='s' name='name' direction='in' />"
        "           <arg type='s' name='greeting' direction='out' />"
        "       </method>"
        "   </interface>"
        "</node>";
```

Add function call in the <code>handle_method_call</code>

```c
static void handle_method_call(GDBusConnection * conn,
                               const gchar * sender,
                               const gchar *object_path,
                               const gchar * interface_name,
                               const gchar * method_name,
                               GVariant * parameters,
                               GDBusMethodInvocation *invocation,
                               gpointer user_data)
{
    if(g_strcmp0(method_name, "sayHello") == 0)
    {
        const char * response = "Hello from GDBus service";
        g_dbus_method_invocation_return_value(invocation, g_variant_new("(s)", response));
    }

    if(g_strcmp0(method_name, "sayWithIn") == 0)
    {
        const gchar * name;
        g_variant_get(parameters, "(&s)", &name);

        gchar *greeting = g_strdup_printf("Hello, %s!", name);

        g_dbus_method_invocation_return_value(
            invocation,
            g_variant_new("(s)", greeting)
        );

        g_free(greeting);
    }
}
```

#### With introspect

```sh
gdbus introspect --session \
        --dest org.example.myService \
        --object-path /org/example/myObject 
```

```sh
node /org/example/myObject {
  ...
  interface org.example.myInterface {
    methods:
      sayHello(out s greeting);
      sayWithIn(in  s name,
                out s greeting);
    signals:
    properties:
  };
};
```

#### Invoke the call
```sh
gdbus call --session --dest org.example.myService \
    --object-path /org/example/myObject \
    --method org.example.myInterface.sayWithIn Pradeep
```

```sh
('Hello, Pradeep!',)
```

## Things to check in GDBUS

Want to:
    Send/receive multiple arguments?
    Return structs or arrays?
    Emit or handle signals?


1. Can I have multiple Objects in a single service
2. Can I have multiple interfaces in a single object
3. Why are using xml for interface creation? Is there any other option?
4. Why we are refering to `introspection_data->interfaces[0]` to 0th value, why not other index.
5. What is the use of `gpointer user_data` in handle_method_call?
