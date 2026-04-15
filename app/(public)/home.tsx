import { SearchBar } from "@/components/SearchBar";
import Header from "@/components/ui/header";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, StyleSheet } from "react-native";
import { useState } from "react";
import SectionTitle from "@/components/home/title";
import HomePlans from "@/components/home/myplans";
import TodaysFocus from "@/components/home/myexercises";


export default function Home() {
    const [searchQuery, setSearchQuery] = useState("");
    const handleSearchChange = (text: string) => {
        setSearchQuery(text);
    };
    
    
    return ( 
        <SafeAreaView style={styles.screen}>
                <Header title="Home" />
                <SearchBar value={searchQuery} onChangeText={handleSearchChange} />


                <HomePlans />
                <TodaysFocus />
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "#121212",
        padding: 24,
    },

})



