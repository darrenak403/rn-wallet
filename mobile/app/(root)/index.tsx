import {SignedIn, SignedOut, useUser} from "@clerk/clerk-expo";
import {Link, useRouter} from "expo-router";
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Alert,
  RefreshControl,
} from "react-native";
import {SignOutButton} from "@/components/SignOutButton";
import {useTransactions} from "@/hooks/useTransactions";
import {useEffect, useState} from "react";
import PageLoader from "@/components/PageLoader";
import {styles} from "@/assets/styles/home.styles";
import {Ionicons} from "@expo/vector-icons";
import {BalanceCard} from "@/components/BalanceCard";
import {TransactionItem} from "@/components/TransactionItem";
import NoTransactionsFound from "@/components/NoTransactionsFound";

export default function Page() {
  const {user} = useUser();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const {transactions, summary, isLoading, loadData, deleteTransaction} =
    useTransactions(user?.id || "");

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  // console.log("userId:", user?.id);
  console.log("transactions:", JSON.stringify(transactions, null, 2));
  // console.log("summary:", JSON.stringify(summary, null, 2));
  const handleDelete = (transactionId: number) => {
    // changed to string
    Alert.alert(
      "Delete Transaction",
      "Are you sure you want to delete this transaction?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteTransaction(transactionId),
        },
      ]
    );
  };
  if (isLoading && !refreshing) return <PageLoader />;
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          {/* LEFT */}
          <View style={styles.headerLeft}>
            <Image
              source={require("../../assets/images/logo-wallet.png")}
              style={styles.headerLogo}
              resizeMode="contain"
            />
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>Welcome,</Text>
              <Text style={styles.usernameText}>
                {user?.emailAddresses[0]?.emailAddress.split("@")[0]}
              </Text>
            </View>
          </View>
          {/* RIGHT */}
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push("/create")}
            >
              <Ionicons name="add" size={24} color="white" />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
            <SignOutButton />
          </View>
        </View>

        {/* Balance Card */}
        <BalanceCard
          summary={{
            balance: String(summary.balance),
            income: String(summary.income),
            expenses: String(summary.expenses),
          }}
        />

        <View style={styles.transactionsHeaderContainer}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
        </View>
      </View>

      {/* FlatList is a performant way to render large lists of data in React Native */}
      {/* It renders items lazily, meaning it only renders items that are currently visible on the screen */}
      <FlatList
        style={styles.transactionsList}
        contentContainerStyle={styles.transactionsListContent}
        data={transactions}
        renderItem={({item}) => (
          <TransactionItem item={item} onDelete={handleDelete} />
        )}
        ListEmptyComponent={<NoTransactionsFound />}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}
