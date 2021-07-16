import React, { Component } from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';

var data;

export default class App extends Component {

  state = {
    viewState: false
  }

  async componentDidMount() {

    this.fetchData();

  }

  fetchData = async () => {

    var xpath = require('xpath');
    var dom = require('xmldom').DOMParser;

    var den = new Date().getDay();

    for (var i = 0; i < 2; i++) {
      if (i == 0) {

        const response = await fetch("https://www.pivnice-ucapa.cz/denni-menu.php");
        var xml = await response.text();
        var doc = new dom({ errorHandler: {} }).parseFromString(xml);
        var path = "/html/body/main/div[2]/div/div/div/div/div[2]/div[1]";

        data = [{ restaurace: "Pivnice u Čápa", jidlo: "", cena: "" }];

        for (var y = 1; y < 5; y++) {
          data.push({
            restaurace: "",
            jidlo: (xpath.select(`${path}/div[${den}]/div[2]/div[${y}]/div[1]`, doc))[0].firstChild.data,
            cena: y == 2 ? (xpath.select(`${path}/div[${den}]/div[2]/div[2]/div[2]`, doc))[0].firstChild.data : y == 3 ? (xpath.select(`${path}/div[${den}]/div[2]/div[3]/div[2]`, doc))[0].firstChild.data : (xpath.select(`${path}/div[${den}]/div[2]/div[4]/div[2]`, doc))[0].firstChild.data
          })
        }

      }
      if (i == 1) {

        const response = await fetch("http://www.suzies.cz/poledni-menu");
        var xml = await response.text();
        var doc = new dom({ errorHandler: {} }).parseFromString(xml);
        var path = "//*[@id='food-grid']/div[2]/div";

        data.push({ restaurace: "Restaurace Suzie's Steakhouse", jidlo: "", cena: "" });

        var pom;
        if (den == 1) pom = 1;
        if (den == 2) pom = 3;
        if (den == 3) pom = 5;
        if (den == 4) pom = 7;
        if (den == 5) pom = 9;
        data.push({
          restaurace: "",
          jidlo: ((xpath.select(`${path}/div[${pom}]/div[2]/div`, doc))[0].firstChild.data).replace(/\s+/g, ' ').trim(),
          cena: ""
        });
        for (var y = 3; y < 5; y++) {
          data.push({
            restaurace: "",
            jidlo: ((xpath.select(`${path}/div[${pom}]/div[${y}]/div[1]`, doc))[0].firstChild.data).replace(/\s+/g, ' ').trim(),
            cena: ""
          });
        }

        this.setState({ viewState: true })
      }
    }

  }

  render() {

    const d = new Date();
    const days = ["Neděle", "Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota"];
    const months = ["Ledna", "Února", "Března", "Dubna", "Května", "Čerevna", "Července", "Srpna", "Září", "Října", "Listopadu", "Prosince"];

    return (
      <View style={styles.container}>
        <Text style={{ color: "white", fontSize: 35, left: "4%", top: "10%", fontWeight: 'bold', position: "absolute" }}>Fuudie - denní menu</Text>
        <Text style={{ color: "white", fontSize: 17, left: "4%", top: "15%", fontWeight: "700", position: "absolute" }}>{days[d.getDay()]}, {d.getDate()}. {months[d.getMonth()]}</Text>
        <View style={{ width: "100%", height: "80%", bottom: 0, borderTopLeftRadius: 20, borderTopRightRadius: 20, position: "absolute", backgroundColor: "white" }}>
          {this.state.viewState ? <FlatList data={data} initialNumToRender={20}
            renderItem={({ item, index }) => {
              return (
                <View>
                  {item.restaurace == "" ?
                    <View style={{ paddingVertical: 10 }}>
                      <Text style={[styles.jidlo1]}>{(index == 1 || index == 6) ? "Polévka: " : index == 7 ? "Pizza1: " : index == 8 ? "Pizza2: " : ""}{item.jidlo}</Text>
                      <Text style={[styles.jidlo1, { fontWeight: "400", paddingTop: (index == 1 || index == 6) ? 0 : 10, height: (index == 1 || index == 6) ? 0 : 28 }]}>{(index == 1 || index == 6) ? "" : index == 7 ? "118 Kč" : index == 8 ? "126 Kč" : item.cena}</Text>
                    </View>
                    :
                    <Text style={{ left: "5%", fontSize: 20, fontWeight: "700", paddingTop: 20 }}>{item.restaurace}</Text>}
                </View>
              );
            }}
            style={{ width: "100%", height: "100%", paddingTop: 20, backgroundColor: "white", borderRadius: 20 }}
            contentContainerStyle={{ paddingBottom: "50%" }}
            keyExtractor={(item, index) => index.toString()} />
            :
            <SkeletonContent
              containerStyle={{ width: "100%", height: "100%%", position: "absolute", backgroundColor: "#f2f2f2", borderRadius: 20 }}
              isLoading={true}
              layout={[
                { width: "90%", height: "90%", left: "5%", top: "5%", borderRadius: 20, position: "absolute" }
              ]}
            >
            </SkeletonContent>}
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#008000'
  },
  jidlo1: {
    left: "5%",
    paddingRight: "10%",
    fontSize: 15,
    fontWeight: "200"
  }
});
