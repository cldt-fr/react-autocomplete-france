import { useAutocomplete } from '../../hooks'

export function ExampleAutocomplete() {
  const { query, setQuery, suggestions, isLoading, isOpen, selectSuggestion } = useAutocomplete({
    onSelect: (suggestion) => console.log('Selected:', suggestion),
  })

  return (
    <div style={{ position: 'relative', width: '400px' }}>
      <h1>Test de recherche</h1>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Rechercher une adresse..."
        style={{
          width: '100%',
          padding: '8px',
          fontSize: '16px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          boxSizing: 'border-box',
        }}
      />
      {isOpen && (
        <ul
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            border: '1px solid #e7e7e7',
            backgroundColor: 'white',
            listStyleType: 'none',
            margin: 0,
            padding: 0,
            maxHeight: '200px',
            overflowY: 'auto',
            borderRadius: '4px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
            zIndex: 1000,
          }}
        >
          {isLoading ? (
            <li style={{ padding: '8px', textAlign: 'center', color: '#999' }}>Chargement...</li>
          ) : (
            suggestions.map((suggestion) => (
              <li
                role="option"
                aria-selected={false}
                key={suggestion.properties.id}
                onClick={() => selectSuggestion(suggestion)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') selectSuggestion(suggestion)
                }}
                tabIndex={0}
                style={{
                  padding: '8px',
                  borderBottom: '1px solid #e7e7e7',
                  cursor: 'pointer',
                  fontSize: '0.9em',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {suggestion.properties.label}
              </li>
            ))
          )}
          <li
            style={{
              fontSize: '0.5em',
              textAlign: 'right',
              padding: '8px',
              textTransform: 'uppercase',
              color: '#cecece',
            }}
          >
            Propulsé par <a href="https://data.geopf.fr/geocodage">Géoplateforme</a>
          </li>
        </ul>
      )}
    </div>
  )
}
