import React, { useState } from "react";
import * as dayjs from "dayjs";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import Modal from "react-modal";
import { Data } from "../src/data";
import relativeTime from "dayjs/plugin/relativeTime";
import translations from "./translations";

dayjs.extend(relativeTime);

const App = () => {
  const [campaigns, setCampaigns] = useState(Data);
  const [selectedTab, setSelectedTab] = useState("past");

  const [modalData, setModalData] = useState(null);

  const [selectedDate, setSelectedDate] = useState(null);
  const [reschedulingCampaign, setReschedulingCampaign] = useState(null);

  const [language, setLanguage] = useState("en");

  const getCategory = (timestamp) => {
    const today = dayjs();
    const campaignDate = dayjs(timestamp);
    if (campaignDate.isAfter(today)) return "upcoming";
    if (campaignDate.isSame(today, "day")) return "live";
    return "past";
  };

  const categorizedCampaigns = campaigns.filter(
    (c) => getCategory(c.createdOn) === selectedTab
  );

  const handleReschedule = (campaign, date) => {
    const updatedCampaigns = campaigns.map((c) =>
      c === campaign ? { ...c, createdOn: date.getTime() } : c
    );
    setCampaigns(updatedCampaigns);
    setReschedulingCampaign(null);
  };

  const handleOpenRescheduleModal = (campaign) => {
    setSelectedDate(null);
    setReschedulingCampaign(campaign);
  };

  return (
    <div className="app p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-end mb-8">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="border rounded px-4 py-2"
        >
          <option value="en">English</option>
          <option value="hi">हिंदी</option>
        </select>
      </div>

      <div className="tabs flex mb-1 space-x-4">
        {["upcoming", "live", "past"].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 font-semibold rounded ${
              selectedTab === tab
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            } hover:bg-blue-400 hover:text-white transition`}
            onClick={() => setSelectedTab(tab)}
          >
            {translations[language][tab]}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <div className="min-w-[680px]">
          <table className="w-full text-left">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-4 font-medium text-gray-700">
                  {translations[language].date}
                </th>
                <th className="p-4 font-medium text-gray-700">
                  {translations[language].campaign}
                </th>
                <th className="p-4 font-medium text-gray-700">
                  {translations[language].region}
                </th>
                <th className="p-4 font-medium text-gray-700">
                  {translations[language].actions}
                </th>
              </tr>
            </thead>
            <tbody>
              {categorizedCampaigns.map((campaign) => (
                <tr
                  key={campaign.name}
                  className="hover:bg-gray-100 transition"
                >
                  <td className="p-4">
                    <div className="flex flex-col gap-2">
                      <span>
                        {dayjs(campaign.createdOn, "DD MM YYYY").format(
                          "DD/MM/YYYY"
                        )}
                      </span>
                      <span>{dayjs(campaign.createdOn).fromNow()}</span>
                    </div>
                  </td>
                  <td className="p-4">{campaign.name}</td>
                  <td className="p-4">{campaign.region}</td>
                  <td className="p-4 space-x-2">
                    <button
                      className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 transition"
                      onClick={() => setModalData(campaign)}
                    >
                      {translations[language].details}
                    </button>
                    <button
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                      onClick={() => handleOpenRescheduleModal(campaign)}
                    >
                      {translations[language].reschedule}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalData && (
        <Modal
          isOpen
          onRequestClose={() => setModalData(null)}
          className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
          <h2 className="text-2xl font-semibold mb-4">{modalData.name}</h2>
          <p className="text-gray-700 mb-4">
            {translations[language].price}: {modalData.price}
          </p>
          <p className="text-gray-700 mb-4">
            {translations[language].csv}: {modalData.csv}
          </p>
          <p className="text-gray-700 mb-4">
            {translations[language].report}: {modalData.report}
          </p>
          <p className="text-gray-700 mb-4">
            {translations[language].imageUrl}: {modalData.image_url}
          </p>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            onClick={() => setModalData(null)}
          >
            {translations[language].close}
          </button>
        </Modal>
      )}

      {reschedulingCampaign && (
        <Modal
          isOpen
          onRequestClose={() => setReschedulingCampaign(null)}
          className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
          <div className="mb-4">
            <h2 className="text-2xl font-semibold mb-2">
              {translations[language].rescheduleCampaign}
            </h2>
            <h2 className="text-2xl font-medium">
              {reschedulingCampaign.name}
            </h2>
          </div>
          <div className="mb-4">
            <DatePicker
              selected={selectedDate}
              onChange={(date) => {
                setSelectedDate(date);
              }}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div className="flex gap-2">
            <button
              disabled={selectedDate === null}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition disabled:bg-gray-400"
              onClick={() => handleReschedule(reschedulingCampaign, selectedDate)}
            >
              {translations[language].confirm}
            </button>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
              onClick={() => setReschedulingCampaign(null)}
            >
              {translations[language].close}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default App;
