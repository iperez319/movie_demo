import Head from 'next/head'
import styles from '../styles/Home.module.css'
import {Button, Container} from "@material-ui/core";
import NavBar from "../components/NavBar";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </div>
  )
}
