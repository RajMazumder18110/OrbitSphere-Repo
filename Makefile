include .env

approve:
	@cast send 0x1Dd8Fd2Fb6D3a51aAc5803b58E4135bbe2Eec841 "approve(address,uint256)" 0x972b861ebbf74583f2f27c42d11132b03eb8d493 10000000000000 --account orbitsphere --rpc-url $(BLOCKCHAIN_RPC_ENDPOINT)

rent:
	@cast send 0x972b861ebBf74583F2F27C42d11132b03EB8d493 "rentOrbitSphereInstance(bytes32,bytes32,uint256,bytes)" 0x61702d736f7574682d3100000000000000000000000000000000000000000000 0x74322e6d6963726f000000000000000000000000000000000000000000000000 3600 0x6d7920737368206b657900000000000000000000000000000000000000000000 --account orbitsphere --rpc-url $(BLOCKCHAIN_RPC_ENDPOINT)

terminate:
	@cast send 0x972b861ebBf74583F2F27C42d11132b03EB8d493 "terminateOrbitSphereInstance(uint256)" $(id) --account orbitsphere --rpc-url $(BLOCKCHAIN_RPC_ENDPOINT)


dev:
	@bun run --filter "*" dev

# Docker builds
build:
	@echo "Builing micro services..."
	@bun run --filter "*" build

	@echo "Builing docker images..."
	@docker build -t raj18110mazumder/orbitsphere-rental-service:latest -f services/rental/Dockerfile services/rental