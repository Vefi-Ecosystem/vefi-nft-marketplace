import { getAddress } from '@ethersproject/address';
import { arrayify, hexValue } from '@ethersproject/bytes';
import { id as mHash } from '@ethersproject/hash';
import { Web3Provider } from '@ethersproject/providers';
import { keccak256 } from '@ethersproject/solidity';
import { Button, Input, message, Modal } from 'antd';
import _ from 'lodash';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { FaArrowRight, FaChevronDown } from 'react-icons/fa';
import { FiArrowDown, FiSearch } from 'react-icons/fi';
import { useMoralisWeb3Api } from 'react-moralis';
import type Web3 from 'web3';
import { AppConfigs, Chain, ChainFactory, ChainFactoryConfigs } from 'xp.network';

import chains from '../chains.json';
import ConnectWallet from '../components/ConnectWallet';
import UnsupportedChain from '../components/error/UnsupportedChain';
import MainFooter from '../components/Footer';
import Navbar from '../components/Navbar';
import { useSocket } from '../contexts/socket';
import { useWeb3Context } from '../contexts/web3';
import {
  BridgeBackground,
  BridgeChainWrapper,
  BridgeContainer,
  ChainOptions,
  SelectChainOptions
} from '../styles/bridge.styled';
import { SectionWrapper } from '../styles/createCollections.styled';

const chainIcons = {
  56: '/icons/binance.svg',
  137: '/icons/matic.svg',
  43114: '/icons/avax.svg',
  32520: '/icons/brise.svg',
  40: '/icons/telos.svg',
  1024: '/icons/clover.svg',
  86: '/icons/gatechain.svg'
};

const bridgeChain: { [key: number]: any } = {
  56: Chain.BSC,
  137: Chain.POLYGON,
  43114: Chain.AVALANCHE,
  86: Chain.GATECHAIN
};

const supportedChains = [43114, 137, 56, 86];
const moralisSupportedChains = [43114, 137, 56];

// export async function getServerSideProps(context: any) {

//   return {
//     props: {
//       factory: JSON.parse(JSON.stringify(factory)),
//       bridgeChain: JSON.parse(JSON.stringify(bridgeChain))
//     }
//   };
// }

const Bridge = () => {
  const moralisWeb3Api = useMoralisWeb3Api();
  const [isTokensModalVisible, setIsTokensModalVisible] = useState<boolean>(false);
  const [isChainsModalVisible, setIsChainsModalVisible] = useState<boolean>(false);
  const [nftList, setNFTList] = useState<Array<any>>([]);

  const { chainId, account, active, library, network } = useWeb3Context();
  const { socket } = useSocket();

  const [tokenSearchValue, setTokenSearchValue] = useState<string>('');
  const [selectedNFT, setSelectedNFT] = useState<any>(null);
  const [selectedDestinationChainKey, setSelectedDestinationChainKey] = useState<keyof typeof chains>('56');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  const allConditionsSatisfied = (): boolean =>
    !!selectedNFT && !!selectedDestinationChainKey && selectedDestinationChainKey !== chainId?.toString();

  const bridgeToken = async () => {
    try {
      if (allConditionsSatisfied()) {
        setIsLoading(true);
        const messageHash = keccak256(
          ['bytes32', 'string', 'address'],
          [mHash('sign_up '.concat(account as string)), 'sign_up', account]
        );
        const ethersProvider = new Web3Provider((library as Web3).givenProvider);
        const signer = ethersProvider.getSigner();
        const signature = await signer.signMessage(arrayify(messageHash));
        const config = await ChainFactoryConfigs.MainNet();
        const factory = ChainFactory(AppConfigs.MainNet(), config);
        const departureChain = await factory.inner(bridgeChain[chainId as number]);
        const destinationChain = await factory.inner(bridgeChain[parseInt(selectedDestinationChainKey)]);
        const nft = {
          ...selectedNFT,
          uri: selectedNFT.token_uri,
          image: selectedNFT.metadata.image,
          native: {
            chainId: chainId?.toString(),
            tokenId: selectedNFT.token_id,
            owner: account as string,
            contract: selectedNFT.token_address,
            symbol: selectedNFT.symbol,
            name: selectedNFT.name,
            uri: selectedNFT.token_uri,
            contractType: selectedNFT.contract_type
          }
        };
        message.info('Approving minter');
        const isApproved = await departureChain.approveForMinter(nft, signer);

        if (!isApproved) throw new Error('Not approved');

        await factory.transferNft(departureChain, destinationChain, nft, signer, account as string);

        socket?.emit(
          'bridge',
          JSON.stringify({
            collectionId: getAddress(nft.native.contract),
            tokenId: parseInt(nft.native.tokenId),
            network,
            signature,
            owner: account as string,
            messageHash,
            bridgeRequestBody: nft
          })
        );

        message.success('Successfully bridged NFT');

        router.replace(`/users/${account}`);
      }
      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      message.error(error.message);
    }
  };

  useEffect(() => {
    if (active && !!chainId && !!account) {
      if (moralisSupportedChains.includes(chainId))
        (async () => {
          const nfts = await moralisWeb3Api.account.getNFTs({
            chain: hexValue(chainId as number) as any,
            address: account as string
          });
          setNFTList(nfts.result!);
        })();
    }
  }, [active, chainId, account]);

  return (
    <>
      <SectionWrapper>
        <Navbar />
        {!active ? (
          <ConnectWallet />
        ) : (
          <>
            {supportedChains.includes(chainId as number) ? (
              <BridgeBackground>
                <div className="exploreNft"></div>
                <div className="bg__left"></div>
                <BridgeContainer>
                  <div className="container">
                    <div className="heading">
                      <h2>
                        Transfer NFTs <br />
                        between blockchains
                      </h2>
                    </div>
                    <div className="container__wrapper">
                      <div className="list__wrapper" onClick={() => setIsTokensModalVisible(!isTokensModalVisible)}>
                        <div className="list__logo">
                          <Image
                            src={chainIcons[chainId as number as keyof typeof chainIcons] || '/icons/eth.svg'}
                            width={30}
                            height={30}
                            alt="image"
                          />
                        </div>
                        <div className="list__text">
                          {chains[chainId?.toString() as keyof typeof chains]?.name || 'Departure chain'} (
                          {selectedNFT?.metadata.name})
                        </div>
                        <div className="list__icon">
                          <FaChevronDown />
                        </div>
                      </div>

                      <div className="list__switch">
                        <FiArrowDown />
                      </div>
                      <div className="list__wrapper" onClick={() => setIsChainsModalVisible(!isChainsModalVisible)}>
                        <div className="list__logo">
                          <Image
                            src={
                              chainIcons[parseInt(selectedDestinationChainKey) as keyof typeof chainIcons] ||
                              '/icons/eth.svg'
                            }
                            width={30}
                            height={30}
                            alt="image"
                          />
                        </div>
                        <div className="list__text">Destination chain</div>
                        <div className="list__icon">
                          <FaChevronDown />
                        </div>
                      </div>
                    </div>
                    <div className="button__wrapper">
                      <Button
                        type="primary"
                        disabled={!allConditionsSatisfied() || isLoading}
                        onClick={bridgeToken}
                        loading={isLoading}
                      >
                        Bridge <FaArrowRight className="btn__icon" />
                      </Button>
                    </div>
                  </div>
                </BridgeContainer>
              </BridgeBackground>
            ) : (
              <UnsupportedChain supportedChains={['Avalanche', 'Polygon', 'Binance']} />
            )}
          </>
        )}
        <MainFooter />
      </SectionWrapper>
      <Modal
        visible={isTokensModalVisible}
        onOk={() => setIsTokensModalVisible(false)}
        width={350}
        wrapClassName="select__chain__wrap"
        onCancel={() => setIsTokensModalVisible(false)}
      >
        <BridgeChainWrapper>
          <div className="select__chain__heading">Select Token</div>
          <div className="select__chain__search">
            <Input
              value={tokenSearchValue}
              onChange={e => setTokenSearchValue(e.target.value)}
              size="large"
              placeholder="Search"
              prefix={<FiSearch />}
            />
          </div>
          <div className="select__chain__container">
            {_.filter(nftList, nft => !!nft.metadata)
              .map(nft => ({ ...nft, metadata: JSON.parse(nft.metadata) }))
              .filter(nft => {
                if (tokenSearchValue.trim().length > 0)
                  return nft.metadata.name.toLowerCase().includes(tokenSearchValue.toLowerCase());
                else return nft;
              })
              .map(nft => (
                <SelectChainOptions
                  key={nft.token_address.concat(`:${nft.token_id}`)}
                  onClick={() => {
                    setSelectedNFT(nft);
                    setIsTokensModalVisible(false);
                  }}
                >
                  <ChainOptions>
                    <div className="chain__logo">
                      <img src={nft.metadata?.image || ''} width={30} height={30} alt="image" />
                    </div>
                    <div className="chain__text">{nft.metadata?.name}</div>
                  </ChainOptions>
                </SelectChainOptions>
              ))}
          </div>
        </BridgeChainWrapper>
      </Modal>
      <Modal
        visible={isChainsModalVisible}
        onOk={() => setIsChainsModalVisible(false)}
        width={350}
        wrapClassName="select__chain__wrap"
        onCancel={() => setIsChainsModalVisible(false)}
      >
        <BridgeChainWrapper>
          <div className="select__chain__heading">Select Chain</div>
          {/* <div className="select__chain__search">
            <Input size="large" placeholder="Search" prefix={<FiSearch />} />
          </div> */}
          <div className="select__chain__container">
            {_.filter(Object.keys(chains), key => supportedChains.includes(parseInt(key))).map(key => (
              <SelectChainOptions
                key={key}
                onClick={() => {
                  setSelectedDestinationChainKey(key as keyof typeof chains);
                  setIsChainsModalVisible(false);
                }}
              >
                <ChainOptions>
                  <div className="chain__logo">
                    <Image
                      src={chainIcons[parseInt(key) as keyof typeof chainIcons] || '/icons/eth.svg'}
                      width={30}
                      height={30}
                      alt="image"
                    />
                  </div>
                  <div className="chain__text">{chains[key as keyof typeof chains].name}</div>
                </ChainOptions>
              </SelectChainOptions>
            ))}
          </div>
        </BridgeChainWrapper>
      </Modal>
    </>
  );
};

export default Bridge;
