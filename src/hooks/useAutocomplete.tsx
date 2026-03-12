import { useCallback, useEffect, useRef, useState } from 'react'
import { AutocompleteFeature, AutocompleteQueryParams } from '../types'
import AutocompleteAPI from '../api/AutocompleteAPI'

export interface UseAutocompleteProps {
  /** Called when a suggestion is selected */
  onSelect?: (suggestion: AutocompleteFeature) => void
  /** Debounce delay in ms (default: 300) */
  debounce?: number
  /** Max number of suggestions (default: 5) */
  limit?: number
  /** Additional search params passed to the API */
  searchParams?: Partial<Omit<AutocompleteQueryParams, 'q' | 'autocomplete' | 'limit'>>
  /** Custom API base URL */
  baseURL?: string
}

export interface UseAutocompleteReturn {
  /** Current search query */
  query: string
  /** Update the search query */
  setQuery: (value: string) => void
  /** List of autocomplete suggestions */
  suggestions: AutocompleteFeature[]
  /** Whether the API request is in progress */
  isLoading: boolean
  /** Whether the suggestions list should be displayed */
  isOpen: boolean
  /** Select a suggestion and clear the list */
  selectSuggestion: (suggestion: AutocompleteFeature) => void
  /** Clear suggestions and query */
  clear: () => void
}

export default function useAutocomplete({
  onSelect,
  debounce = 300,
  limit = 5,
  searchParams,
  baseURL,
}: UseAutocompleteProps = {}): UseAutocompleteReturn {
  const [suggestions, setSuggestions] = useState<AutocompleteFeature[]>([])
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const apiRef = useRef(new AutocompleteAPI(baseURL))

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([])
      return
    }

    const controller = new AbortController()

    const fetchSuggestions = async () => {
      setIsLoading(true)
      try {
        const response = await apiRef.current.searchAddress({
          q: query,
          autocomplete: '1',
          limit,
          ...searchParams,
        })
        if (!controller.signal.aborted) {
          setSuggestions(response.features)
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error('Error fetching suggestions:', error)
          setSuggestions([])
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    const timeout = setTimeout(fetchSuggestions, debounce)

    return () => {
      clearTimeout(timeout)
      controller.abort()
    }
  }, [query, limit, debounce, searchParams])

  const selectSuggestion = useCallback(
    (suggestion: AutocompleteFeature) => {
      setQuery(suggestion.properties.label)
      setSuggestions([])
      onSelect?.(suggestion)
    },
    [onSelect],
  )

  const clear = useCallback(() => {
    setQuery('')
    setSuggestions([])
  }, [])

  const isOpen = query.trim().length > 0 && (isLoading || suggestions.length > 0)

  return {
    query,
    setQuery,
    suggestions,
    isLoading,
    isOpen,
    selectSuggestion,
    clear,
  }
}
