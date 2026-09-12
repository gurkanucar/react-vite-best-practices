# 031 — Account Settings

`/account` is the settings side of a user: general details, billing, notifications, social
links, and security, across five tabs. Like [030](030-profile-screen.md) it was built from
a Material UI template screenshot using Ant Design components, and like that screen the
interesting part is which component each piece of the design turned out to be.

| Part of the design         | Component                                   |
| -------------------------- | ------------------------------------------- |
| The five tabs, with icons  | `Tabs` with a `Flex` label                  |
| Every field                | `Form.Item` + `Input` / `Select` / `Switch` |
| Dashed avatar circle       | `Upload` with `listType="picture-circle"`   |
| Country and dialling code  | `Select` + `country-flag-icons`             |
| "Delete user"              | `Button danger` inside `Popconfirm`         |
| Invoice history            | `Table`                                     |
| Password fields            | `Input.Password`                            |
| Character counter on About | `Input.TextArea` with `showCount`           |

The custom CSS is five declarations: a flag size, two spacings, and `height: 100%` so the
upload card matches the form beside it.

## One pane at a time

The panes are rendered after `Tabs` rather than as each item's `children`:

```tsx
<Tabs activeKey={tab} onChange={…} items={ACCOUNT_TABS.map(…)} />
<Pane />
```

Handing `children` to every item mounts all five. Five forms would each hold their own
state and run their own validation for a screen the reader can only see one fifth of.

## Two fields that read as one control

The phone number is a dialling-code `Select` and a text `Input` sharing a border. Ant
Design has a component for exactly that — `Space.Compact` — so no layout CSS is needed:

```tsx
<Space.Compact block>
  <Form.Item name="countryCode" noStyle><Select … /></Form.Item>
  <Form.Item name="phone" noStyle><Input allowClear /></Form.Item>
</Space.Compact>
```

`noStyle` is what keeps the inner items from each drawing their own label and margin.
`Input.Group`, which is the older way to do this, is deprecated.

## A rule that depends on another field

"Confirm new password" cannot be a static rule, because the answer depends on what was
typed above it. Ant Design passes the form instance to a rule written as a function:

```tsx
;({ getFieldValue }) => ({
  validator(_rule, value) {
    if (!value || getFieldValue('next') === value) return Promise.resolve()
    return Promise.reject(new Error(messages.account.passwordMismatch))
  },
})
```

`dependencies={['next']}` is the other half: without it the confirmation is not
re-validated when the field above changes.

## Upload validation without an upload

There is no endpoint behind the avatar. `beforeUpload` returning `false` stops Ant Design
from starting a request, while still running the checks a real one needs — type and size —
and reporting them. That is the part worth demonstrating; the request is not.

## Flags are imported one by one

```ts
import CA from 'country-flag-icons/react/3x2/CA'
```

Rather than the package index, which would pull every flag in the world into the bundle
for the five this screen offers.

## Marking optional fields

`requiredMark="optional"` labels every field that is not required. On a form where most
fields are optional that is noise on almost every line, so this one uses
`requiredMark={false}` and lets the validation messages do the work.
