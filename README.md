# react-autocomplete-france

Headless React hook for French address autocomplete powered by the [Géoplateforme API](https://data.geopf.fr/geocodage).

**Zero UI opinions** bring your own components, styles and UI kit (MUI, Ant Design, shadcn/ui, Mantine, Tailwind, plain HTML...).

![Exemple](./ressources/example.png)

## Installation

```bash
npm install react-autocomplete-france
```

Peer dependencies: `react >= 18.2.0`

## Quick start

```tsx
import { useAutocomplete } from 'react-autocomplete-france'

function AddressInput() {
  const { query, setQuery, suggestions, isLoading, isOpen, selectSuggestion } = useAutocomplete({
    onSelect: (suggestion) => {
      console.log(suggestion.properties.label)
      console.log(suggestion.geometry.coordinates) // [lon, lat]
    },
  })

  return (
    <div style={{ position: 'relative' }}>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Rechercher une adresse..."
      />
      {isOpen && (
        <ul>
          {isLoading ? (
            <li>Chargement...</li>
          ) : (
            suggestions.map((s) => (
              <li key={s.properties.id} onClick={() => selectSuggestion(s)}>
                {s.properties.label}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  )
}
```

## API Reference

### `useAutocomplete(options?)`

Headless hook — returns state and handlers, renders nothing.

#### Options

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onSelect` | `(suggestion: AutocompleteFeature) => void` | — | Called when a suggestion is selected |
| `debounce` | `number` | `300` | Debounce delay in ms |
| `limit` | `number` | `5` | Max number of results |
| `searchParams` | `Partial<AutocompleteQueryParams>` | — | Additional API params (`postcode`, `type`, `city`, `citycode`...) |
| `baseURL` | `string` | `https://data.geopf.fr/geocodage` | Custom API base URL (e.g. your own proxy) |

#### Return value

| Property | Type | Description |
|----------|------|-------------|
| `query` | `string` | Current search query |
| `setQuery` | `(value: string) => void` | Update the search query (bind to your input's `onChange`) |
| `suggestions` | `AutocompleteFeature[]` | List of address suggestions |
| `isLoading` | `boolean` | Whether the API request is in progress |
| `isOpen` | `boolean` | Whether the suggestions list should be shown |
| `selectSuggestion` | `(suggestion: AutocompleteFeature) => void` | Select a suggestion (updates query, clears list, calls `onSelect`) |
| `clear` | `() => void` | Clear query and suggestions |

## Examples

### With Material UI (MUI)

```tsx
import { TextField, List, ListItemButton, ListItemText, Paper, CircularProgress } from '@mui/material'
import { useAutocomplete } from 'react-autocomplete-france'

function MUIAddressInput() {
  const { query, setQuery, suggestions, isLoading, isOpen, selectSuggestion } = useAutocomplete({
    onSelect: (s) => console.log(s),
  })

  return (
    <div style={{ position: 'relative' }}>
      <TextField
        fullWidth
        label="Adresse"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        slotProps={{
          input: {
            endAdornment: isLoading ? <CircularProgress size={20} /> : null,
          },
        }}
      />
      {isOpen && (
        <Paper sx={{ position: 'absolute', zIndex: 10, width: '100%', mt: 0.5 }}>
          <List dense>
            {suggestions.map((s) => (
              <ListItemButton key={s.properties.id} onClick={() => selectSuggestion(s)}>
                <ListItemText primary={s.properties.label} secondary={s.properties.context} />
              </ListItemButton>
            ))}
          </List>
        </Paper>
      )}
    </div>
  )
}
```

### With Ant Design

```tsx
import { Input, List, Spin } from 'antd'
import { useAutocomplete } from 'react-autocomplete-france'

function AntdAddressInput() {
  const { query, setQuery, suggestions, isLoading, isOpen, selectSuggestion } = useAutocomplete({
    onSelect: (s) => console.log(s),
  })

  return (
    <div style={{ position: 'relative' }}>
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Rechercher une adresse..."
        suffix={isLoading ? <Spin size="small" /> : null}
      />
      {isOpen && (
        <List
          style={{ position: 'absolute', zIndex: 10, width: '100%', background: '#fff' }}
          bordered
          size="small"
          dataSource={suggestions}
          renderItem={(s) => (
            <List.Item onClick={() => selectSuggestion(s)} style={{ cursor: 'pointer' }}>
              {s.properties.label}
            </List.Item>
          )}
        />
      )}
    </div>
  )
}
```

### With Chakra UI v2

```tsx
import { Box, Input, InputGroup, InputRightElement, List, ListItem, Spinner, Text } from '@chakra-ui/react'
import { useAutocomplete } from 'react-autocomplete-france'

function ChakraV2AddressInput() {
  const { query, setQuery, suggestions, isLoading, isOpen, selectSuggestion } = useAutocomplete({
    onSelect: (s) => console.log(s),
  })

  return (
    <Box position="relative">
      <InputGroup>
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher une adresse..."
        />
        {isLoading && (
          <InputRightElement>
            <Spinner size="sm" />
          </InputRightElement>
        )}
      </InputGroup>
      {isOpen && (
        <List
          position="absolute"
          zIndex={10}
          width="100%"
          mt={1}
          bg="white"
          borderWidth="1px"
          borderRadius="md"
          boxShadow="md"
          maxH="250px"
          overflowY="auto"
        >
          {suggestions.map((s) => (
            <ListItem
              key={s.properties.id}
              px={4}
              py={2}
              cursor="pointer"
              _hover={{ bg: 'gray.100' }}
              borderBottomWidth="1px"
              onClick={() => selectSuggestion(s)}
            >
              <Text fontSize="sm" isTruncated>{s.properties.label}</Text>
              <Text fontSize="xs" color="gray.500">{s.properties.context}</Text>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  )
}
```

### With Chakra UI v3

```tsx
import { Box, Input, List, Spinner, Text, Group } from '@chakra-ui/react'
import { InputGroup } from '@chakra-ui/react/input-group'
import { useAutocomplete } from 'react-autocomplete-france'

function ChakraV3AddressInput() {
  const { query, setQuery, suggestions, isLoading, isOpen, selectSuggestion } = useAutocomplete({
    onSelect: (s) => console.log(s),
  })

  return (
    <Box position="relative">
      <InputGroup endElement={isLoading ? <Spinner size="sm" /> : undefined}>
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher une adresse..."
        />
      </InputGroup>
      {isOpen && (
        <List.Root
          position="absolute"
          zIndex={10}
          width="100%"
          mt={1}
          bg="white"
          borderWidth="1px"
          borderRadius="md"
          boxShadow="md"
          maxH="250px"
          overflowY="auto"
          listStyle="none"
        >
          {suggestions.map((s) => (
            <List.Item
              key={s.properties.id}
              px={4}
              py={2}
              cursor="pointer"
              _hover={{ bg: 'gray.100' }}
              borderBottomWidth="1px"
              onClick={() => selectSuggestion(s)}
            >
              <Text fontSize="sm" truncate>{s.properties.label}</Text>
              <Text fontSize="xs" color="fg.muted">{s.properties.context}</Text>
            </List.Item>
          ))}
        </List.Root>
      )}
    </Box>
  )
}
```

### With Tailwind CSS

```tsx
import { useAutocomplete } from 'react-autocomplete-france'

function TailwindAddressInput() {
  const { query, setQuery, suggestions, isLoading, isOpen, selectSuggestion } = useAutocomplete({
    onSelect: (s) => console.log(s),
  })

  return (
    <div className="relative w-full max-w-md">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Rechercher une adresse..."
        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
      />
      {isOpen && (
        <ul className="absolute z-10 mt-1 w-full max-h-60 overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg">
          {isLoading ? (
            <li className="px-4 py-2 text-center text-gray-500">Chargement...</li>
          ) : (
            suggestions.map((s) => (
              <li
                key={s.properties.id}
                onClick={() => selectSuggestion(s)}
                className="cursor-pointer truncate px-4 py-2 hover:bg-blue-50"
              >
                <span className="font-medium">{s.properties.name}</span>
                <span className="ml-2 text-sm text-gray-500">{s.properties.context}</span>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  )
}
```

### Filtered search (streets only in a specific postcode)

```tsx
const { query, setQuery, suggestions, isOpen, selectSuggestion } = useAutocomplete({
  searchParams: { type: 'street', postcode: '75001' },
  onSelect: (s) => console.log(s),
})
```

### Direct API usage (without React)

```ts
import { AutocompleteAPI } from 'react-autocomplete-france'

const api = new AutocompleteAPI()
const results = await api.autocompleteAddress('10 rue de la paix', 5)
console.log(results.features)

// Advanced search
const results2 = await api.searchAddress({
  q: 'rue de la paix',
  type: 'street',
  postcode: '75002',
  limit: 3,
})
```

## Types

All types are exported:

```ts
import type {
  AutocompleteFeature,
  AutocompleteProperties,
  AutocompleteGeometry,
  AutocompleteResponse,
  AutocompleteQueryParams,
  UseAutocompleteProps,
  UseAutocompleteReturn,
} from 'react-autocomplete-france'
```

### `AutocompleteFeature`

```ts
interface AutocompleteFeature {
  type: string
  geometry: {
    type: string
    coordinates: number[] // [longitude, latitude]
  }
  properties: {
    label: string        // "10 Rue de la Paix 75002 Paris"
    score: number
    id: string
    name: string         // "10 Rue de la Paix"
    postcode: string     // "75002"
    citycode: string     // "75102"
    city: string         // "Paris"
    context: string      // "75, Paris, Île-de-France"
    type: string         // "housenumber" | "street" | "locality" | "municipality"
    importance: number
    street?: string
    housenumber?: string
    district?: string
    x: number
    y: number
  }
}
```

## Migration from v1.x

### Recommended: migrate to the headless hook

v2.0 adopts a **headless** pattern — the hook no longer renders any UI.

**Before (v1):**
```tsx
import { useAutocomplete } from 'react-autocomplete-france'

const { ref } = useAutocomplete({
  onSuggestionSelected: (s) => console.log(s),
  containerStyle: { backgroundColor: 'white' },
  hasWatermark: true,
})

return <input ref={ref} />
```

**After (v2):**
```tsx
import { useAutocomplete } from 'react-autocomplete-france'

const { query, setQuery, suggestions, isLoading, isOpen, selectSuggestion } = useAutocomplete({
  onSelect: (s) => console.log(s),
})

return (
  <div>
    <input value={query} onChange={(e) => setQuery(e.target.value)} />
    {isOpen && (
      <ul>
        {isLoading
          ? <li>Chargement...</li>
          : suggestions.map((s) => (
              <li key={s.properties.id} onClick={() => selectSuggestion(s)}>
                {s.properties.label}
              </li>
            ))
        }
      </ul>
    )}
  </div>
)
```

### Changes summary

| v1 | v2 |
|----|-----|
| `onSuggestionSelected` | `onSelect` |
| `containerStyle`, `suggestionStyle`, `suggestionLabelStyle` | Render your own UI |
| `hasWatermark` | Add your own attribution |
| `alignementRef`, `containerPosition` | Position your own dropdown |
| Returns `{ ref }` | Returns `{ query, setQuery, suggestions, isLoading, isOpen, selectSuggestion, clear }` |
| Default debounce `500ms` | Default debounce `300ms` |
| — | New: `searchParams` for filtered searches |
| — | New: `baseURL` for custom API endpoint |
| — | New: `AutocompleteAPI` exported |

### Deprecated: keep v1 behavior with `useAutocompleteLegacy`

If you can't migrate immediately, switch to `useAutocompleteLegacy` — a drop-in replacement with the exact same v1 API:

```diff
- import { useAutocomplete } from 'react-autocomplete-france'
+ import { useAutocompleteLegacy } from 'react-autocomplete-france'

- const { ref } = useAutocomplete({
+ const { ref } = useAutocompleteLegacy({
    onSuggestionSelected: (s) => console.log(s),
    containerStyle: { border: '1px solid red' },
    hasWatermark: true,
  })
```

> **Warning:** `useAutocompleteLegacy` is deprecated and will be removed in the next major version. It renders its own UI via DOM portals and is not compatible with custom UI kits. Migrate to `useAutocomplete` when possible.

## Contributing

You can contribute to this project by opening an issue or a pull request.

## License

MIT
