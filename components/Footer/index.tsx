import Image from 'next/image';
import React from 'react';
import { FaFacebook, FaGithub, FaTelegram } from 'react-icons/fa';
import { AiFillTwitterCircle } from 'react-icons/ai';
import { Container, FootLink, SubDiv1, SubDiv2 } from '../../styles/footer.styled';
import Link from 'next/link';

function MainFooter() {
  return (
    <Container>
      <SubDiv1>
        <div className="stay_loop">
          <h4 className="loop_text">Stay in the loop</h4>
          <p className="loop_desc">
            Join our mailing list to stay in the loop with our newest feature release, <br />
            NFT dopes, and tips and tricks for navigating vefi NFT.
          </p>
        </div>
        <div>
          <form action="" className="signup">
            <div>
              <input type="email" name="" id="" placeholder="Your email address" />
            </div>
            <div>
              <button type="submit">Sign Up</button>
            </div>
          </form>
        </div>
        <div className="logo_container">
          <Image src="/logo/vefi_nft_logo.svg" height={40} width={100} />
        </div>
        <div className="community">
          <h5 className="join">Join Our Community</h5>
          <div className="socials">
            <FaGithub className="icon" />
            <FaTelegram className="icon" />
            <AiFillTwitterCircle className="icon" />
            <FaFacebook className="icon" />
          </div>
        </div>
      </SubDiv1>
      <SubDiv2>
        <div className="marketplace">
          <h2 className="nav_section">Marketplace</h2>
          {marketplaceArray.slice(0, 10).map(({ label, path }: any) => (
            <FootLink key={label}>
              <Link href={path}>
                <a>{label}</a>
              </Link>
            </FootLink>
          ))}
        </div>
        <div className="my_account">
          <div>
            <h2 className="nav_section">My Account</h2>
            {marketplaceArray.slice(10, 14).map(({ label, path }: any) => (
              <FootLink key={label}>
                <Link href={path}>
                  <a>{label}</a>
                </Link>
              </FootLink>
            ))}
          </div>
          <div>
            <h2 className="nav_section">Stats</h2>
            {marketplaceArray.slice(14, 16).map(({ label, path }: any) => (
              <FootLink key={label}>
                <Link href={path}>
                  <a>{label}</a>
                </Link>
              </FootLink>
            ))}
          </div>
        </div>
        <div className="company">
          <h2 className="nav_section">Company</h2>
          {marketplaceArray.slice(14, 18).map(({ label, path }: any) => (
            <FootLink key={label}>
              <Link href={path}>
                <a>{label}</a>
              </Link>
            </FootLink>
          ))}
        </div>
      </SubDiv2>
    </Container>
  );
}

export default MainFooter;

const marketplaceArray = [
  {
    label: 'All Nfts',
    path: '#'
  },
  {
    label: 'Arts',
    path: '#'
  },
  {
    label: 'Sports Memorabilla',
    path: '#'
  },
  {
    label: 'Collectibles',
    path: '#'
  },
  {
    label: 'Video-Games Sticker',
    path: '#'
  },
  {
    label: 'Virtual Land',
    path: '#'
  },
  {
    label: 'Memes ',
    path: '#'
  },
  {
    label: 'Music',
    path: '#'
  },
  {
    label: 'Ticketing',
    path: '#'
  },
  {
    label: 'Domain Names',
    path: '#'
  },
  {
    label: 'Profile',
    path: '#'
  },
  {
    label: 'My Favourites',
    path: '#'
  },
  {
    label: 'Watchlist',
    path: '#'
  },
  {
    label: 'My Collection',
    path: '#'
  },
  {
    label: 'Ranking',
    path: '#'
  },
  {
    label: 'Activity',
    path: '#'
  },
  {
    label: 'About',
    path: '#'
  },
  {
    label: 'Careers',
    path: '#'
  },
  {
    label: 'Ventures',
    path: '#'
  },
  {
    label: 'Grants',
    path: '#'
  }
];
