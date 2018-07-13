## P2P

An invisible helper field. It renders nothing in the admin, but gives a list of P2P-related post IDs to get_panel_var()

### Parameters

||||
|---|---|---|
| `name`        | `string` | The unique name for this field                 |
| `connection_type` | `string` | The P2P connection type to use |
| `limit` | `string` | The max connections to query |

### Example

```php
$field = new P2P( array(
    'name' => 'related_posts',
    'connection_type' => 'the_connection_type_id',
    'limit' => 6,
) );
```