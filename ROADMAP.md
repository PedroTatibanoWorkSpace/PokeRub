# 🗺️ ROADMAP - PokéRub

## ✅ Histórias Implementadas

### 📋 História 1: Visualização e Busca de Pokémons
**Status**: ✅ **COMPLETA**

**Descrição**: "Eu como usuário do PokeRub, quero visualizar todos os pokemons existentes por nome, havendo a possibilidade de filtrar pelo nome e consultar suas características (tipo, altura, peso, categoria e habilidades), para entendermos do que o pokemon é capaz."

**Como foi implementado**:
- **Lista Principal**: `PokemonListScreen` com grid responsivo de 2 colunas
- **Paginação Infinita**: Hook `usePokemonList` com React Query Infinite Queries
- **Busca Inteligente**: `SearchBar` com debounce de 500ms, busca por nome e ID
- **Cache Otimizado**: React Query com stale time de 10 minutos
- **Estados de Loading**: Placeholders animados durante carregamento
- **Características Detalhadas**: Altura, peso, tipos, habilidades, estatísticas base

**Tecnologias Utilizadas**:
```typescript
export function usePokemonList() {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.POKEMON_LIST],
    queryFn: ({ pageParam = 0 }) => 
      pokemonRepository.getPokemonList(20, pageParam),
    getNextPageParam: (lastPage, allPages) => {
      const totalLoaded = allPages.length * 20;
      return totalLoaded < lastPage.count ? totalLoaded : undefined;
    },
    initialPageParam: 0, 
    staleTime: 10 * 60 * 1000,
    enabled: true,
  });
}
```

**Features Extras Implementadas**:
- Refresh pull-to-reload
- Error states elegantes com EmptyState
- Busca por número do pokémon além do nome
- Header personalizado "PokéRub" com ícone

---

### 🔄 História 2: Sistema de Evoluções
**Status**: ✅ **COMPLETA**

**Descrição**: "Eu como usuário do PokeRub, quero poder visualizar quais evoluções são possíveis de um pokemon específico, havendo a possibilidade de evoluir o pokemon se desejado para que eu tenha o pokemon evoluído."

**Como foi implementado**:
- **Cadeia Evolutiva**: `EvolutionScreen` com visualização hierárquica completa
- **Requisitos de Evolução**: Detecção automática de nível, itens, condições especiais
- **Navegação entre Evoluções**: Toque em qualquer pokémon da cadeia para ver seus detalhes
- **Funcionalidade de Evolução**: Sistema demonstrativo com Alert confirmativo

**Componente Principal**:
```typescript
export function EvolutionChain({
  chainLink,
  onPokemonPress,
}: EvolutionChainProps) {
  return (
    <View style={styles.container}>
      <EvolutionStage chainLink={chainLink} onPress={onPokemonPress} />

      {chainLink.evolves_to.map((evolution, index) => (
        <View key={index} style={styles.evolutionContainer}>
          <View style={styles.arrowContainer}>
            <View style={styles.arrowLine} />
            <View style={styles.arrowCircle}>
              <Text style={styles.arrowText}>⚡</Text>
            </View>
            <View style={styles.arrowLine} />
            {evolution.evolution_details[0] && (
              <View style={styles.evolutionRequirementContainer}>
                <Text style={styles.evolutionRequirement}>
                  {getEvolutionRequirement(evolution.evolution_details[0])}
                </Text>
              </View>
            )}
          </View>
          <EvolutionChain
            chainLink={evolution}
            onPokemonPress={onPokemonPress}
          />
        </View>
      ))}
    </View>
  );
}
```

**Features Implementadas**:
- Detecção automática de todos os tipos de requisitos (nível, itens, horário, felicidade, troca)
- Interface visual com setas e ícones intuitivos
- Suporte a evoluções múltiplas e ramificadas
- Botão funcional "Evoluir Pokémon" com feedback

**Desafio Técnico**: A PokeAPI requer múltiplas requisições encadeadas (species → evolution-chain → pokemon details)

---

### ❤️ História 3: Sistema de Favoritos
**Status**: ✅ **COMPLETA**

**Descrição**: "Eu como usuário do PokeRub, quero salvar meus pokemons favoritos em uma lista a parte para que eu possa consultar sempre que desejado."

**Como foi implementado**:
- **Persistência Local**: AsyncStorage para dados offline
- **Lista de Favoritos**: `FavoritesScreen` com modos grid/lista
- **Gerenciamento Completo**: Adicionar, remover individual, limpar todos
- **Sincronização**: Estados consistentes entre todas as telas


**Hook de Favoritos**:
```typescript
export function useFavorites() {
  return useQuery({
    queryKey: [QUERY_KEYS.FAVORITES],
    queryFn: () => favoriteRepository.getFavorites(),
    staleTime: 0,
  });
}

export function useAddFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (pokemon: Pokemon) => {
      const favorite: Favorite = {
        id: pokemon.id,
        name: pokemon.name,
        imageUrl: pokemon.sprites.other['official-artwork'].front_default || 
                  pokemon.sprites.front_default || '',
        types: pokemon.types.map(t => t.type.name),
        addedAt: new Date().toISOString(),
      };
      return favoriteRepository.addFavorite(favorite);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FAVORITES] });
    },
  });
}

export function useRemoveFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (pokemonId: number) => favoriteRepository.removeFavorite(pokemonId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FAVORITES] });
    },
  });
}
```

## 🧩 O que eu adicionaria com mais tempo

- Animações mais fluidas ao navegar entre telas
- Tela de splash inicial com loading de recursos
- Melhor responsividade e adaptação de UI para tablets
- Testes unitários nos repositórios e hooks principais
- Tela de erro global com retry automático

## 🛠️ O que eu faria diferente com mais tempo

- Usaria Zustand ou Jotai para estado local em vez de `useState` simples
- Criaria um Design System com componentes reutilizáveis desde o início
- Melhoraria a separação de estilos com styled-components
- Adicionaria testes end-to-end com Detox

**Features Avançadas**:
- Indicadores visuais de favoritos em todos os cards
- Contadores dinâmicos na FavoritesScreen
- Badges de posição na lista de favoritos
- Confirmação para limpeza em massa
- Toggle entre visualização grid/lista

---

## 🚀 Arquitetura Implementada

### Clean Architecture
