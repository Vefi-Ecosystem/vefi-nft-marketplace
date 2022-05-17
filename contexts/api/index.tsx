import React, { createContext, useState, useContext, useEffect } from 'react';
import { AccountModel } from '../../api/models/account';
import { NFTModel } from '../../api/models/nft';
import {
  getNFTsByOwner,
  getNFTsByCollection,
  getAllNFTsByNetwork,
  signToken,
  getAuthenticatedUser
} from '../../api/nft';

export enum APIErrorPoint {
  NFTS_BY_USER,
  NFTS_BY_COLLECTION,
  NFTS_BY_NETWORK,
  TOKEN_LOAD,
  AUTH_USER
}

type APIContextType = {
  nftsByUser: Array<NFTModel>;
  nftsByCollection: Array<NFTModel>;
  nftsByNetwork: Array<NFTModel>;
  isUserAuthenticated: boolean;
  authenticatedUser?: AccountModel;
  loadAuthUser: () => void;
  loadToken: (accountId: any) => void;
  loadNFTsByUser: (page?: number) => void;
  loadNFTsByCollection: (collection: string, page?: number) => void;
  loadNFTsByNetwork: (network: string, page?: number) => void;
  error?: {
    point: APIErrorPoint;
    message: string;
  };
};

const APIContext: React.Context<APIContextType> = createContext<APIContextType>({} as APIContextType);

export const APIContextProvider = ({ children }: any) => {
  const [error, setError] = useState<{ point: APIErrorPoint; message: string }>();
  const [nftsByUser, setNFTsByUser] = useState<Array<NFTModel>>([]);
  const [nftsByCollection, setNFTsByCollection] = useState<Array<NFTModel>>([]);
  const [nftsByNetwork, setNFTsByNetwork] = useState<Array<NFTModel>>([]);
  const [authenticatedUser, setAuthenticatedUser] = useState<AccountModel>();
  const [isUserAuthenticated, setIsUserAuthenticated] = useState<boolean>(false);
  const [token, setToken] = useState<string>('');

  const clearError = () => {
    setError(undefined);
  };

  const loadToken = (accountId: string) => {
    clearError();
    signToken({ accountId })
      .then(res => setToken(res.token))
      .catch((error: any) => setError({ point: APIErrorPoint.NFTS_BY_USER, message: error.message }));
  };

  const loadAuthUser = () => {
    clearError();
    getAuthenticatedUser(token)
      .then(setAuthenticatedUser)
      .catch((error: any) => setError({ point: APIErrorPoint.AUTH_USER, message: error.message }));
  };

  const loadNFTsByUser = (page: number = 1) => {
    clearError();
    getNFTsByOwner(token, '', page)
      .then(setNFTsByUser)
      .catch((error: any) => setError({ point: APIErrorPoint.NFTS_BY_USER, message: error.message }));
  };

  const loadNFTsByCollection = (collection: string, page: number = 1) => {
    clearError();
    getNFTsByCollection(collection, '', page)
      .then(setNFTsByCollection)
      .catch((error: any) => setError({ point: APIErrorPoint.NFTS_BY_COLLECTION, message: error.message }));
  };

  const loadNFTsByNetwork = (network: string, page: number = 1) => {
    clearError();
    getAllNFTsByNetwork(network, page)
      .then(setNFTsByNetwork)
      .catch((error: any) => setError({ point: APIErrorPoint.NFTS_BY_NETWORK, message: error.message }));
  };

  useEffect(() => {
    if (!!localStorage.getItem('VEFI_NFT_TOKEN')) {
      setToken(localStorage.getItem('VEFI_NFT_TOKEN') as string);
      setIsUserAuthenticated(true);
    }
  }, []);

  return (
    <APIContext.Provider
      value={{
        nftsByUser,
        nftsByCollection,
        nftsByNetwork,
        loadNFTsByUser,
        loadNFTsByCollection,
        loadNFTsByNetwork,
        loadToken,
        loadAuthUser,
        isUserAuthenticated,
        authenticatedUser,
        error
      }}
    >
      {children}
    </APIContext.Provider>
  );
};

export const useAPIContext = () => useContext(APIContext);