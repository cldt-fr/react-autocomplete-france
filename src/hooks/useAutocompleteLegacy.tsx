import { createRoot } from 'react-dom/client'
import React, { SVGProps, useEffect, useRef, useState } from 'react'
import { AutocompleteFeature } from '../types'
import AutocompleteAPI from '../api/AutocompleteAPI'

interface ContainerPosition {
  top: number
  left: number
}

export interface UseAutocompleteLegacyProps {
  onSuggestionSelected?: (suggestion: AutocompleteFeature) => void
  debounce?: number
  limit?: number
  hasWatermark?: boolean
  containerStyle?: React.CSSProperties
  suggestionStyle?: React.CSSProperties
  suggestionLabelStyle?: React.CSSProperties
  alignementRef?: React.RefObject<HTMLElement>
  containerPosition?: ContainerPosition
}

const MapPin = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="size-5" viewBox="0 0 20 20" {...props}>
    <path
      fillRule="evenodd"
      d="m9.69 18.933.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 0 0 .281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 1 0 3 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 0 0 2.273 1.765 11.842 11.842 0 0 0 .976.544l.062.029.018.008.006.003ZM10 11.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z"
      clipRule="evenodd"
    />
  </svg>
)

/**
 * @deprecated Use `useAutocomplete` instead. This legacy hook renders its own UI via DOM portals
 * and will be removed in the next major version. See MIGRATION.md for migration instructions.
 */
export default function useAutocompleteLegacy({
  onSuggestionSelected,
  debounce = 500,
  limit = 5,
  hasWatermark = true,
  containerStyle = {},
  suggestionStyle = {},
  suggestionLabelStyle = {},
  containerPosition,
  alignementRef,
}: UseAutocompleteLegacyProps) {
  const ref = useRef<HTMLInputElement>(null)
  const alignementReference = alignementRef || ref

  const [suggestions, setSuggestions] = useState<AutocompleteFeature[]>([])
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [position, setPosition] = useState({ top: containerPosition?.top, left: containerPosition?.left, width: 0 })

  const handleInput = () => {
    if (!ref.current) return
    setQuery(ref.current.value)
  }

  useEffect(() => {
    if (!query) {
      setSuggestions([])
      return
    }

    const fetchSuggestions = async () => {
      setIsLoading(true)
      try {
        const autocompleteAPI = new AutocompleteAPI()
        const response = await autocompleteAPI.autocompleteAddress(query, limit)
        setSuggestions(response.features)
      } catch (error) {
        console.error('Error fetching suggestions:', error)
      } finally {
        setIsLoading(false)
      }
    }

    const debounceFetch = setTimeout(fetchSuggestions, debounce)

    return () => clearTimeout(debounceFetch)
  }, [query, limit, debounce])

  useEffect(() => {
    const currentRef = ref.current
    if (!currentRef) return
    currentRef.addEventListener('input', handleInput)

    return () => {
      currentRef.removeEventListener('input', handleInput)
    }
  }, [ref])

  useEffect(() => {
    if (alignementReference.current) {
      if (containerPosition) {
        const { width } = alignementReference.current.getBoundingClientRect()
        setPosition({ top: containerPosition.top, left: containerPosition.left, width: width })
        return
      } else {
        const { bottom, left, width } = alignementReference.current.getBoundingClientRect()
        setPosition({ top: bottom, left: left, width })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alignementReference.current, suggestions, ref, containerPosition])

  useEffect(() => {
    if (ref.current && suggestions.length > 0) {
      const suggestionBox = (
        <ul
          style={{
            position: 'relative',
            border: '1px solid #E7E7E7',
            backgroundColor: 'white',
            zIndex: 1000,
            listStyleType: 'none',
            margin: 0,
            padding: 0,
            maxHeight: '200px',
            overflowY: 'auto',
            borderRadius: '4px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.04)',
            ...containerStyle,
          }}
        >
          {isLoading ? (
            <li style={{ padding: '8px', textAlign: 'center' }}>Chargement...</li>
          ) : (
            suggestions.map((suggestion, index) => (
              // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
              <li
                key={index}
                style={{
                  padding: '8px',
                  borderBottom: '1px solid #E7E7E7',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  ...suggestionStyle,
                }}
                onMouseDown={() => {
                  if (!ref.current) return
                  ref.current.value = suggestion.properties.label
                  setSuggestions([])
                  if (onSuggestionSelected) onSuggestionSelected(suggestion)
                }}
              >
                <MapPin width={15} />
                <span
                  style={{
                    fontSize: '0.9em',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    width: 'calc(100% - 20px)',
                    ...suggestionLabelStyle,
                  }}
                >
                  {suggestion.properties.label}
                </span>
              </li>
            ))
          )}
          {hasWatermark && (
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
          )}
        </ul>
      )

      const portalElement = document.createElement('div')
      portalElement.id = 'autocomplete-portal'
      portalElement.style.position = 'absolute'
      portalElement.style.zIndex = '10'
      portalElement.style.top = position.top + 'px'
      portalElement.style.left = position.left + 'px'
      portalElement.style.width = position.width + 'px'

      if (!ref.current) return
      ref.current.parentNode?.insertBefore(portalElement, ref.current.nextSibling)
      const root = createRoot(portalElement)
      root.render(suggestionBox)

      return () => {
        root.unmount()
        portalElement.remove()
      }
    }
  }, [suggestions, position, ref, isLoading, containerStyle, suggestionStyle, suggestionLabelStyle, hasWatermark, onSuggestionSelected])

  return { ref }
}
