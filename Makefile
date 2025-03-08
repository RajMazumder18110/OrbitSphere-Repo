include .env

approve:
	@cast send 0x1Dd8Fd2Fb6D3a51aAc5803b58E4135bbe2Eec841 "approve(address,uint256)" 0x972b861ebbf74583f2f27c42d11132b03eb8d493 10000000000000 --account orbitsphere --rpc-url $(BLOCKCHAIN_RPC_ENDPOINT)

rent:
	@cast send 0x972b861ebBf74583F2F27C42d11132b03EB8d493 "rentOrbitSphereInstance(bytes32,bytes32,uint256,bytes)" 0x61702d736f7574682d3100000000000000000000000000000000000000000000 0x74322e6d6963726f000000000000000000000000000000000000000000000000 3600 0x7373682d727361204141414142334e7a6143317963324541414141444151414241414143415144426e35773536447949434e6f5856517549306a7844497946514763694b6e7041354238677258347a364f2f4e444b334358623430774e424a616769776a68793966596633445265355272745074727075556f4b6a68324f4f2b63397438434278474d366367714a516c355a54545070726b534353784b656b68317159376657745133384743485372396e7a586d694630494b4e5a793932454a393157464f7664703131345348316a76626c533757496a504d54764b693538767a3458507274574936587a595649526c587638663145484a7033624d615463665042514e43506d49464d377853576c454c50726e6a4f54674b70434a796d326b4f5852346e567358584130593468764c6c73436c315174726f5a794b4e49674c6d61775436657032444c693157657a644a76644c4c673755446c57597a6e2f62376a4b46623766416d57692b46734863537339477a48416a4b3167315365305a43595545634f57347873463978575874625634647936552f5a444743466546657439354349367a31656e666c313036414a6a566a6270386153654f324a6442754b4c4e4152396337372f654c67612f6f45596f476a372b362f456344497864356859474a41656b55464a6172624d733653726b32696a5955766b3172782b47786c546c2f4e6d666554362b61486e574f33456353573279614e324f38634e614276316c76424d704e6c744b7338316b483159793238584f525068365648346f43772f6e4e563455613664326333376d696d57746e7a6d6373526f33496f5372594c4249644a78743078565668366338386764725732584b2b344d476539743659453549564e684b63324e33524b684a6d7458336756474b6d67744c73646b5630534f7a673868384e79744d695535596c73486c5952714a76526964436f6f6767304e47347a4a4345435535776265595857513d3d000000000000000000000000 --account orbitsphere --rpc-url $(BLOCKCHAIN_RPC_ENDPOINT)

terminate:
	@cast send 0x972b861ebBf74583F2F27C42d11132b03EB8d493 "terminateOrbitSphereInstance(uint256)" $(id) --account orbitsphere --rpc-url $(BLOCKCHAIN_RPC_ENDPOINT)


dev:
	@bunx dotenv -e .env -- bun run --filter "*" dev 

dev-rental:
	@bun run --filter "@orbitsphere/rental" dev

# Docker builds
build:
	@echo "Builing micro services..."
	@bun run --filter "*" build

	@echo "Builing docker images..."
	@docker build -t raj18110mazumder/orbitsphere-rental-service:latest -f services/rental/Dockerfile services/rental