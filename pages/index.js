import { useState, useEffect } from "react";
import Head from "next/head";
import {
  Button,
  Card,
  Image,
  Transition,
  Container,
  Grid,
  Header,
  Dropdown,
} from "semantic-ui-react";

const cardsOptions = [
  {
    key: "1",
    text: "12",
    value: 12,
  },
  {
    key: "2",
    text: "14",
    value: 14,
  },
  {
    key: "3",
    text: "16",
    value: 16,
  },
];

export default function Home() {
  const [cards, setCards] = useState([]);
  const [totalTry, setTotalTry] = useState(0);
  const [toMatch, setToMatch] = useState(null);
  const [finish, setFinish] = useState(false);
  const [cardsNum, setCardsNum] = useState(12);

  useEffect(() => {
    initialize(cardsNum);
  }, []);

  const initialize = (count) => {
    let newCards = [];
    for (let i = 0; i < count; i += 2) {
      newCards.push({
        src: `/images/${i + 1}.jpg`,
        found: false,
        visible: false,
        identifier: i + 1,
      });
      newCards.push({
        src: `/images/${i + 1}.jpg`,
        found: false,
        visible: false,
        identifier: i + 1,
      });
    }
    shuffle(newCards);
    setCards(newCards);
    setTotalTry(0);
    if (finish) setFinish(false);
  };

  const shuffle = (newCards) => {
    for (let i = newCards.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let x = newCards[j];
      newCards[j] = newCards[i];
      newCards[i] = x;
    }
  };

  const toggleVisible = (index) => {
    if (cards[index].found) return;
    if (!toMatch) {
      console.log("not to match");
      const newCards = cards.map((card, i) => {
        if (i === index) card.visible = true;
        return card;
      });
      setCards(newCards);
      setToMatch({ index, identifier: cards[index].identifier });
    } else {
      console.log("to match");
      setTotalTry(totalTry + 1);
      if (cards[index].identifier === toMatch.identifier) {
        console.log("....to match, and matched");
        const newCards = cards.map((card, i) => {
          if (i === index) {
            card.visible = true;
            card.found = true;
          }
          if (i === toMatch.index) {
            card.found = true;
          }
          return card;
        });
        setCards(newCards);
        setToMatch(null);
      } else {
        console.log("....to match, but not matched");
        const newCards = cards.map((card, i) => {
          if (i === index) card.visible = true;
          return card;
        });
        setCards(newCards);
        setTimeout(() => {
          const newCards = cards.map((card, i) => {
            if (i === toMatch.index) card.visible = false;
            if (i === index) card.visible = false;
            return card;
          });
          setCards(newCards);
          setToMatch(null);
        }, 300);
      }
    }
  };

  const checkFinish = () => {
    const finished = !cards.some((card) => card.found === false);
    if (finished) setFinish(true);
  };

  const playAgain = () => {
    initialize(cardsNum);
  };

  const onCardsNumChange = (event, data) => {
    console.log(data.value);
    if (cardsNum !== data.value) {
      setCardsNum(data.value);
      initialize(data.value);
    }
  };

  const renderCards = () => {
    return cards.map((card, index) => {
      return (
        <Grid.Column key={index}>
          <Card
            onClick={(event) => {
              toggleVisible(index);
              checkFinish();
            }}
          >
            <Transition
              visible={card.visible}
              animation="horizontal flip"
              duration={500}
              mountOnShow={false}
            >
              <Image src={card.src} wrapped ui={false} />
            </Transition>
          </Card>
        </Grid.Column>
      );
    });
  };

  return (
    <Container textAlign="center" style={{ paddingTop: "10vh" }}>
      <Head>
        <title>Memory Puzzle</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header>Choose Number of Cards </Header>
      <Dropdown
        defaultValue={cardsNum}
        fluid
        selection
        options={cardsOptions}
        style={{ marginBottom: "20px" }}
        onChange={onCardsNumChange}
      />
      <Grid columns={6}>{renderCards()}</Grid>
      {finish && <Header>Congratulations!</Header>}
      <Header color="grey" as="h2">{`Total Try: ${totalTry}`}</Header>
      <Button
        content={finish ? "Play Again" : "Start Over"}
        onClick={playAgain}
        color="teal"
        style={{ marginTop: "20px" }}
      />
    </Container>
  );
}
