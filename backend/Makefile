# 1. Configurações do Compilador
CXX = g++
# Adicionamos -I (Include) para o compilador achar os .hpp sem você precisar mudar os #includes no código
CXXFLAGS = -std=c++17 -Wall -pthread -Isrc/api -Isrc/core -Isrc/storage -Isrc/utils
LDFLAGS = -pthread

# 2. Diretórios
SRC_DIR = src
OBJ_DIR = build
BIN_DIR = bin

# 3. Nome do seu executável final
TARGET = $(BIN_DIR)/db

# 4. Encontra todos os arquivos .cpp automaticamente dentro da pasta src e subpastas
SRCS = $(shell find $(SRC_DIR) -name '*.cpp')

# 5. Transforma a lista de .cpp em uma lista de .o (arquivos objeto) na pasta build
OBJS = $(patsubst $(SRC_DIR)/%.cpp, $(OBJ_DIR)/%.o, $(SRCS))

# --- REGRAS DE COMPILAÇÃO ---

# Regra principal: o que acontece quando você digita apenas 'make'
all: $(TARGET)

# Como construir o executável final juntando todos os .o
$(TARGET): $(OBJS)
	@mkdir -p $(BIN_DIR)
	@echo "Linking the executable $@"
	$(CXX) $(CXXFLAGS) -o $@ $^ $(LDFLAGS)

# Como compilar cada arquivo .cpp em um arquivo .o
$(OBJ_DIR)/%.o: $(SRC_DIR)/%.cpp
	@mkdir -p $(dir $@)
	@echo "Compiling $<"
	$(CXX) $(CXXFLAGS) -c $< -o $@

# Regra para limpar o projeto (apagar arquivos compilados)
clean:
	@echo "Cleaning compiled files"
	rm -rf $(OBJ_DIR) $(BIN_DIR)

# Evita conflitos caso você crie um arquivo chamado "clean" ou "all"
.PHONY: all clean