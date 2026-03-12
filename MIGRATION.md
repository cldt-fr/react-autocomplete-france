# Migration from v1.x to v2.0

## Overview

v2.0 adopts a **headless hook** pattern. The hook no longer renders any UI — it returns state and handlers, giving you full control over the rendering with any UI kit or styling approach.

## Breaking changes

### 1. Hook return value changed

**Before (v1):**
```tsx
const { ref } = useAutocomplete({ onSuggestionSelected: handleSelect })
return <input ref={ref} />
```

**After (v2):**
```tsx
const { query, setQuery, suggestions, isLoading, isOpen, selectSuggestion } = useAutocomplete({
  onSelect: handleSelect,
})

return (
  <div>
    <input value={query} onChange={(e) => setQuery(e.target.value)} />
    {isOpen && (
      <ul>
        {isLoading
          ? <li>Loading...</li>
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

### 2. `onSuggestionSelected` renamed to `onSelect`

```diff
- useAutocomplete({ onSuggestionSelected: handleSelect })
+ useAutocomplete({ onSelect: handleSelect })
```

### 3. Style props removed

The following props no longer exist since you now control rendering:

- `containerStyle`
- `suggestionStyle`
- `suggestionLabelStyle`
- `alignementRef`
- `containerPosition`

Apply styles directly to your own JSX elements.

### 4. `hasWatermark` removed

Add your own attribution if desired:

```tsx
<span>Propulsé par <a href="https://data.geopf.fr/geocodage">Géoplateforme</a></span>
```

### 5. New `searchParams` prop

Pass additional API parameters (postcode, type, city, etc.) for filtered searches:

```tsx
useAutocomplete({
  searchParams: { type: 'street', postcode: '75001' },
})
```

### 6. New `baseURL` prop

Override the API endpoint:

```tsx
useAutocomplete({ baseURL: 'https://my-proxy.example.com/geocodage' })
```

### 7. `AutocompleteAPI` is now exported

```ts
import { AutocompleteAPI } from 'react-autocomplete-france'
const api = new AutocompleteAPI()
const results = await api.autocompleteAddress('10 rue de la paix')
```

### 8. `react-dom` no longer a peer dependency

The hook no longer creates portals. Only `react` is required as a peer dependency.

### 9. Default debounce changed from 500ms to 300ms

## Not ready to migrate? Use `useAutocompleteLegacy`

A drop-in replacement with the exact same v1 API is available:

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

> **Warning:** `useAutocompleteLegacy` is deprecated and will be removed in the next major version.
