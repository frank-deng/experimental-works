import tomllib

config=None
with open('1.toml','rb') as f:
    config=tomllib.load(f)

print(config)
print(config.get('port',23))
