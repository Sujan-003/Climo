import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalStorage } from "./use-local-storage"

interface FavoriteCity{
    id: string,
    lat: number,
    lon: number,
    name: string,
    country: string,
    state?: string,
    addedAt: number
}

export function useFavorites() {
    const [favorites, setFavorites] = useLocalStorage<FavoriteCity[]>(
        "favorites",
        []
    );
    const queryClient = useQueryClient();


    const favoritesQuery = useQuery({
        queryKey : ["favorites"],
        queryFn : () => favorites,
        initialData : favorites,
        staleTime: Infinity
})

    const addFavorite = useMutation({
        mutationFn: async (city: Omit<FavoriteCity, "id" | "addedAt">) => {
            const id =`${city.lat}-${city.lon}`
            const addedAt = Date.now();
            const newFavorite : FavoriteCity = {
                ...city,
                id,
                addedAt
            }
            const exists = favorites.some((fav) => fav.id === newFavorite.id)
            if(exists)return;

            const newFavorites = [...favorites, newFavorite]
            setFavorites(newFavorites)
            return newFavorites

        },

        onSuccess() {
            queryClient.invalidateQueries({queryKey: ["favorites"]})
            
        },
    }) 

    const removeFavorite = useMutation(
        {
            mutationFn : async (cityID : string) => {
                const filteredFavorites = favorites.filter((fav)=> fav.id !== cityID)
                setFavorites(filteredFavorites)
                return filteredFavorites
            },
            onSuccess(){
                queryClient.invalidateQueries({queryKey: ['favorites']})
            }
            
        }
    )

    return {
        favorites: favoritesQuery.data,
        addFavorite,
        removeFavorite,
        isFavorite: (lat: number, lon: number) => {
            return favorites.some((city) => (city.lat === lat && city.lon === lon))
        }
    }

}