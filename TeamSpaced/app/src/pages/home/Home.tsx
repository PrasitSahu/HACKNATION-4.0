import { Geolocation } from "@capacitor/geolocation";
import { CameraIcon, HomeIcon, UserIcon } from "@heroicons/react/24/outline";
import { Block, Button, Card, Page, Tabbar, TabbarLink } from "konsta/react";
import React, { useEffect, useState } from "react";
import CameraPage from "../Camera/Camera";
import { fetchLocation, Location } from "../location/Location";
import Hero from "./Hero";
import NavBar from "./NavBar";

type tab = "tab-1" | "tab-2" | "tab-3";

const Home = () => {
  const [name, setName] = useState<string>("Mahindra Singh");
  const [location, setLocation] = useState<Location | null>();
  const [addressVisible, setAddressVisible] = useState(true);
  const [activeTab, setActiveTab] = useState<tab>("tab-1");
  const [tabState, setTabState] = useState<tab>("tab-1");
  const [isTabbarLabels, setIsTabbarLabels] = useState(true);
  const [isTabbarIcons, setIsTabbarIcons] = useState(false);
  const [tabbarVisible, setTabbarVisible] = useState(true);

  useEffect(() => {
    let cachedLocation = localStorage.getItem("location");
    if (!cachedLocation) {
      Geolocation.getCurrentPosition().then((res) => {
        const lat = res?.coords.latitude;
        const long = res?.coords.longitude;
        localStorage.setItem("lat", lat.toString());
        localStorage.setItem("long", long.toString());

        fetchLocation(lat, long).then((data) => {
          localStorage.setItem("location", JSON.stringify(data));
          cachedLocation = data as any;
        });
      });
    }
    setLocation(cachedLocation ? JSON.parse(cachedLocation) : null);
  }, []);

  function setRightPanelOpened(arg0: boolean): void {
    throw new Error("Function not implemented.");
  }

  return (
    <Page className={`overflow-hidden`}>
      {activeTab === "tab-1" && (
        <>
          <NavBar
            name={name}
            address={`${location?.address.city.split(" ")[0]}, ${
              location?.address.state_district
            }`}
            addressVisible={addressVisible}
          />
          <Hero
            onHeroChange={(state) => {
              if (state) setAddressVisible(false);
              else setAddressVisible(true);
            }}
          />

          <Card raised header="Card header" footer="Card footer">
            <Block
              strongIos
              outlineIos
              className="flex space-x-4 rtl:space-x-reverse"
            >
              <Button rounded onClick={() => setRightPanelOpened(true)}>
                Left Panel
              </Button>
              <Button rounded onClick={() => setRightPanelOpened(true)}>
                Right Panel
              </Button>
            </Block>
          </Card>
        </>
      )}

      {activeTab === "tab-2" && (
        <CameraPage
          onLoad={() => {
            setTabbarVisible(false);
          }}
          onBack={() => {
            setActiveTab(tabState);
            setTabbarVisible(true);
          }}
        />
      )}

      <Tabbar
        labels={isTabbarLabels}
        icons={isTabbarIcons}
        className={`left-0 bottom-0 fixed ${tabbarVisible ? "" : "hidden"}`}
      >
        <TabbarLink
          active={activeTab === "tab-1"}
          onClick={() =>
            setActiveTab((prev) => {
              setTabState(prev);
              return "tab-1";
            })
          }
          label={isTabbarLabels && "Home"}
          icon={<HomeIcon className="w-6" />}
        />
        <TabbarLink
          active={activeTab === "tab-2"}
          onClick={() =>
            setActiveTab((prev) => {
              setTabState(prev);
              return "tab-2";
            })
          }
          icon={<CameraIcon className="w-6" />}
          label={isTabbarLabels && "Camera"}
        />
        <TabbarLink
          active={activeTab === "tab-3"}
          onClick={() =>
            setActiveTab((prev) => {
              setTabState(prev);
              return "tab-3";
            })
          }
          icon={<UserIcon className="w-6" />}
          label={isTabbarLabels && "Profile"}
        />
      </Tabbar>
    </Page>
  );
};

export default Home;
