"use client"

/**
 * Custom hook for Clients data management
 */

import { useState, useCallback } from "react"
import type { Client, PaginationParams } from "@/src/model"

interface UseClientsState {
  clients: Client[]
  loading: boolean
  error: string | null
}

export function useClients() {
  const [state, setState] = useState<UseClientsState>({
    clients: [],
    loading: false,
    error: null,
  })

  const fetchClients = useCallback(async (params?: PaginationParams) => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const result = await clientsApi.getClients(params)
      setState((prev) => ({ ...prev, clients: result.data, loading: false }))
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Failed to fetch clients",
        loading: false,
      }))
    }
  }, [])

  const createClient = useCallback(async (payload: any) => {
    try {
      const newClient = await clientsApi.createClient(payload)
      setState((prev) => ({ ...prev, clients: [...prev.clients, newClient] }))
      return newClient
    } catch (error) {
      throw error
    }
  }, [])

  const updateClient = useCallback(async (id: string, payload: any) => {
    try {
      const updated = await clientsApi.updateClient(id, payload)
      setState((prev) => ({
        ...prev,
        clients: prev.clients.map((c) => (c.id === id ? updated : c)),
      }))
      return updated
    } catch (error) {
      throw error
    }
  }, [])

  const deleteClient = useCallback(async (id: string) => {
    try {
      await clientsApi.deleteClient(id)
      setState((prev) => ({ ...prev, clients: prev.clients.filter((c) => c.id !== id) }))
    } catch (error) {
      throw error
    }
  }, [])

  return {
    clients: state.clients,
    loading: state.loading,
    error: state.error,
    fetchClients,
    createClient,
    updateClient,
    deleteClient,
  }
}
